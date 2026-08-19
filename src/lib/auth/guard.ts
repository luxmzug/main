import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import { consumeAdminApi } from '@/lib/auth/rate-limit';
import { assertSameOrigin, getClientIp, getUserAgent } from '@/lib/auth/request';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import {
  type AdminSession,
  readSession,
  rotateSession,
  sessionCookieHeader,
} from '@/lib/auth/session';

const cookieFromRequest = (request: Request) => {
  const header = request.headers.get('cookie');
  if (!header) {
    return undefined;
  }

  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${SESSION_COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(SESSION_COOKIE.length + 1));
    }
  }

  return undefined;
};

/**
 * Authenticates an admin API request, rate-limits it, and checks same-origin on mutations.
 */
export const requireAdminApi = async (request: Request) => {
  const ip = getClientIp(request);
  const limited = consumeAdminApi(ip);
  if (!limited.ok) {
    throw new AdminHttpError('Zu viele Anfragen.', 429, {
      'Retry-After': String(limited.retryAfterSec),
    });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    assertSameOrigin(request);
  }

  const jar = await cookies();
  const session = readSession(
    jar.get(SESSION_COOKIE)?.value ?? cookieFromRequest(request),
    ip,
    getUserAgent(request),
  );
  if (!session) {
    throw new AdminHttpError('Nicht angemeldet.', 401);
  }

  return { session, ip };
};

/**
 * Appends a rotated session cookie when the current token is due for rotation.
 */
export const applySessionRotation = (response: NextResponse, session: AdminSession) => {
  if (session.shouldRotate) {
    response.headers.append('Set-Cookie', sessionCookieHeader(rotateSession(session.id)));
  }
  return response;
};

export class AdminHttpError extends Error {
  status: number;
  headers: Record<string, string>;

  constructor(message: string, status: number, headers: Record<string, string> = {}) {
    super(message);
    this.name = 'AdminHttpError';
    this.status = status;
    this.headers = headers;
  }
}

/**
 * Maps thrown admin errors to JSON responses.
 */
export const adminErrorResponse = (error: unknown) => {
  if (error instanceof AdminHttpError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers: error.headers },
    );
  }

  if (error instanceof ZodError) {
    const first = error.issues[0]?.message ?? 'Ungültige Eingabe.';
    return NextResponse.json({ error: first }, { status: 400 });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ error: 'Anfrage fehlgeschlagen.' }, { status: 400 });
};
