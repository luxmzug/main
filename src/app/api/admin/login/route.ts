import { NextResponse } from 'next/server';
import { z } from 'zod';
import { consumeLoginAttempt, isLoginLocked } from '@/lib/auth/rate-limit';
import { assertSameOrigin, getClientIp, getUserAgent } from '@/lib/auth/request';
import { createSession, sessionCookieHeader, verifyAdminCredentials } from '@/lib/auth/session';

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export const POST = async (request: Request) => {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: 'Ungültige Herkunft.' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const locked = isLoginLocked(ip);
  if (!locked.ok) {
    return NextResponse.json(
      { error: 'Zu viele Fehlversuche. Bitte später erneut versuchen.' },
      { status: 429, headers: { 'Retry-After': String(locked.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    consumeLoginAttempt(ip, false);
    return NextResponse.json({ error: 'Anmeldung fehlgeschlagen.' }, { status: 401 });
  }

  const ok = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  consumeLoginAttempt(ip, ok);

  if (!ok) {
    const again = isLoginLocked(ip);
    if (!again.ok) {
      return NextResponse.json(
        { error: 'Zu viele Fehlversuche. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(again.retryAfterSec) } },
      );
    }
    return NextResponse.json({ error: 'Anmeldung fehlgeschlagen.' }, { status: 401 });
  }

  const cookie = createSession(ip, getUserAgent(request));
  return NextResponse.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': sessionCookieHeader(cookie),
      },
    },
  );
};
