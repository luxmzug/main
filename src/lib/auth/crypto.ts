import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getEnv } from '@/lib/Env';

/**
 * Hashes a value with SHA-256.
 */
export const sha256 = (value: string) => {
  return createHash('sha256').update(value).digest('hex');
};

/**
 * Creates an HMAC-SHA256 digest using the session secret.
 */
export const hmacSha256 = (value: string) => {
  return createHmac('sha256', getEnv().SESSION_SECRET).update(value).digest('hex');
};

/**
 * Returns a 32-byte hex token.
 */
export const randomToken = () => {
  return randomBytes(32).toString('hex');
};

/**
 * Constant-time string comparison. Returns false when lengths differ.
 */
export const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

/**
 * Hashes a client identifier (IP or User-Agent) with the session secret.
 */
export const hashClientBinding = (value: string) => {
  return sha256(`${getEnv().SESSION_SECRET}:${value}`);
};
