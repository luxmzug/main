import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { getEnv } from '@/lib/Env';
import { SESSION_COOKIE, SESSION_TTL_SEC } from '@/lib/auth/constants';
import { hashClientBinding, hmacSha256, randomToken, safeEqual, sha256 } from '@/lib/auth/crypto';
import { normalizeIp } from '@/lib/auth/request';
import { getDb } from '@/lib/db';
import { sessions } from '@/lib/db/schema';

export { SESSION_COOKIE, SESSION_TTL_SEC };

const rotateAfterMs = 10 * 60 * 1000;

export type AdminSession = {
  id: number;
  tokenHash: string;
  shouldRotate: boolean;
};

let cachedPasswordHash: string | undefined;

const getPasswordHash = async () => {
  if (!cachedPasswordHash) {
    cachedPasswordHash = await bcrypt.hash(getEnv().ADMIN_PASSWORD, 12);
  }
  return cachedPasswordHash;
};

/**
 * Verifies the single admin against environment credentials.
 */
export const verifyAdminCredentials = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const expectedEmail = getEnv().ADMIN_EMAIL.trim().toLowerCase();
  const emailOk = safeEqual(normalizedEmail.padEnd(128, '\0'), expectedEmail.padEnd(128, '\0'));
  const passwordOk = await bcrypt.compare(password, await getPasswordHash());
  return emailOk && passwordOk;
};

/**
 * Builds the signed cookie payload for a raw session token.
 */
export const signSessionCookie = (token: string) => {
  return `${token}.${hmacSha256(token)}`;
};

/**
 * Parses and HMAC-checks a cookie value. Returns the raw token or null.
 */
export const parseSessionCookie = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const separator = value.lastIndexOf('.');
  if (separator <= 0) {
    return null;
  }

  const token = value.slice(0, separator);
  const digest = value.slice(separator + 1);
  if (!token || !digest || !safeEqual(hmacSha256(token), digest)) {
    return null;
  }

  return token;
};

/**
 * Creates a new session bound to IP and User-Agent.
 */
export const createSession = (ip: string, userAgent: string) => {
  const token = randomToken();
  const now = Date.now();
  getDb()
    .insert(sessions)
    .values({
      tokenHash: sha256(token),
      ipHash: hashClientBinding(ip),
      uaHash: hashClientBinding(userAgent),
      expiresAt: now + SESSION_TTL_SEC * 1000,
      lastRotatedAt: now,
      createdAt: now,
    })
    .run();

  return signSessionCookie(token);
};

/**
 * Deletes a session by token hash.
 */
export const destroySessionByHash = (tokenHash: string) => {
  getDb().delete(sessions).where(eq(sessions.tokenHash, tokenHash)).run();
};

/**
 * Rotates the session token while keeping the same row bindings.
 */
export const rotateSession = (sessionId: number) => {
  const token = randomToken();
  const now = Date.now();
  getDb()
    .update(sessions)
    .set({
      tokenHash: sha256(token),
      lastRotatedAt: now,
      expiresAt: now + SESSION_TTL_SEC * 1000,
    })
    .where(eq(sessions.id, sessionId))
    .run();

  return signSessionCookie(token);
};

/**
 * Validates a cookie against the database, IP, and User-Agent bindings.
 */
export const readSession = (cookieValue: string | undefined, ip: string, userAgent: string) => {
  const token = parseSessionCookie(cookieValue);
  if (!token) {
    return null;
  }

  const now = Date.now();
  const row = getDb()
    .select()
    .from(sessions)
    .where(eq(sessions.tokenHash, sha256(token)))
    .get();

  if (!row || row.expiresAt < now) {
    if (row) {
      destroySessionByHash(row.tokenHash);
    }
    return null;
  }

  if (!safeEqual(row.uaHash, hashClientBinding(userAgent))) {
    destroySessionByHash(row.tokenHash);
    return null;
  }

  const nextIpHash = hashClientBinding(normalizeIp(ip));
  if (!safeEqual(row.ipHash, nextIpHash)) {
    getDb().update(sessions).set({ ipHash: nextIpHash }).where(eq(sessions.id, row.id)).run();
  }

  getDb()
    .update(sessions)
    .set({ expiresAt: now + SESSION_TTL_SEC * 1000 })
    .where(eq(sessions.id, row.id))
    .run();

  return {
    id: row.id,
    tokenHash: row.tokenHash,
    shouldRotate: now - row.lastRotatedAt >= rotateAfterMs,
  } satisfies AdminSession;
};

const ipFromHeaders = (headerList: Awaited<ReturnType<typeof headers>>) => {
  const forwarded = headerList.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return normalizeIp(first.slice(0, 64));
    }
  }

  const realIp = headerList.get('x-real-ip')?.trim();
  if (realIp) {
    return normalizeIp(realIp.slice(0, 64));
  }

  return '127.0.0.1';
};

/**
 * Reads the admin session from request cookies in a Server Component.
 */
export const getSession = async () => {
  const jar = await cookies();
  const headerList = await headers();
  return readSession(
    jar.get(SESSION_COOKIE)?.value,
    ipFromHeaders(headerList),
    headerList.get('user-agent') ?? 'unknown',
  );
};

/**
 * Builds Set-Cookie for login/rotation/logout.
 */
export const sessionCookieHeader = (value: string, maxAge = SESSION_TTL_SEC) => {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ];

  if (getEnv().NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
};

/**
 * Builds a clearing Set-Cookie header.
 */
export const clearSessionCookieHeader = () => {
  return sessionCookieHeader('', 0);
};
