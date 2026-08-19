import { and, count, eq, gt, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { loginAttempts } from '@/lib/db/schema';
import { hashClientBinding } from '@/lib/auth/crypto';

const windowMs = 15 * 60 * 1000;
const lockMs = 30 * 60 * 1000;
const maxFailedLogins = 5;
const maxAdminApi = 120;

export type RateLimitResult = {
  ok: boolean;
  retryAfterSec: number;
};

/**
 * Records a login attempt and rejects IPs that exceed the failure threshold.
 */
export const consumeLoginAttempt = (ip: string, success: boolean): RateLimitResult => {
  const db = getDb();
  const ipHash = hashClientBinding(ip);
  const now = Date.now();
  const windowStart = now - windowMs;

  db.insert(loginAttempts)
    .values({
      ipHash,
      attemptedAt: now,
      success: success ? 1 : 0,
    })
    .run();

  db.delete(loginAttempts)
    .where(sql`${loginAttempts.attemptedAt} < ${now - 24 * 60 * 60 * 1000}`)
    .run();

  const failed = db
    .select({ value: count() })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipHash, ipHash),
        eq(loginAttempts.success, 0),
        gt(loginAttempts.attemptedAt, windowStart),
      ),
    )
    .get();

  const failedCount = failed?.value ?? 0;
  if (!success && failedCount >= maxFailedLogins) {
    return { ok: false, retryAfterSec: Math.ceil(lockMs / 1000) };
  }

  return { ok: true, retryAfterSec: 0 };
};

/**
 * Returns whether login is currently locked for this IP.
 */
export const isLoginLocked = (ip: string): RateLimitResult => {
  const db = getDb();
  const ipHash = hashClientBinding(ip);
  const now = Date.now();

  const failed = db
    .select({ value: count() })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipHash, ipHash),
        eq(loginAttempts.success, 0),
        gt(loginAttempts.attemptedAt, now - windowMs),
      ),
    )
    .get();

  if ((failed?.value ?? 0) >= maxFailedLogins) {
    return { ok: false, retryAfterSec: Math.ceil(lockMs / 1000) };
  }

  return { ok: true, retryAfterSec: 0 };
};

/**
 * Caps authenticated admin API traffic per IP.
 */
export const consumeAdminApi = (ip: string): RateLimitResult => {
  const db = getDb();
  const ipHash = hashClientBinding(`api:${ip}`);
  const now = Date.now();

  db.insert(loginAttempts)
    .values({
      ipHash,
      attemptedAt: now,
      success: 1,
    })
    .run();

  const recent = db
    .select({ value: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ipHash, ipHash), gt(loginAttempts.attemptedAt, now - windowMs)))
    .get();

  if ((recent?.value ?? 0) > maxAdminApi) {
    return { ok: false, retryAfterSec: Math.ceil(windowMs / 1000) };
  }

  return { ok: true, retryAfterSec: 0 };
};
