import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { sha256 } from '@/lib/auth/crypto';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import {
  clearSessionCookieHeader,
  destroySessionByHash,
  parseSessionCookie,
} from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { sessions } from '@/lib/db/schema';

export const runtime = 'nodejs';

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

export const POST = async (request: Request) => {
  const token = parseSessionCookie(cookieFromRequest(request));
  if (token) {
    const row = getDb()
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, sha256(token)))
      .get();
    if (row) {
      destroySessionByHash(row.tokenHash);
    }
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': clearSessionCookieHeader(),
      },
    },
  );
};
