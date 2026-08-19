/**
 * Reads the client IP, preferring the first forwarded hop.
 */
export const getClientIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return normalizeIp(first.slice(0, 64));
    }
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) {
    return normalizeIp(realIp.slice(0, 64));
  }

  return '127.0.0.1';
};

/**
 * Treats IPv4/IPv6 loopback as the same client.
 */
export const normalizeIp = (ip: string) => {
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }

  return ip;
};

/**
 * Reads the User-Agent string used as a device binding.
 */
export const getUserAgent = (request: Request) => {
  return (request.headers.get('user-agent') ?? 'unknown').slice(0, 512);
};

/**
 * Rejects cross-site mutating requests. SameSite=Strict is the first line; this is defense in depth.
 */
export const assertSameOrigin = (request: Request) => {
  const host = request.headers.get('host');
  if (!host) {
    throw new Error('Ungültige Anfrage.');
  }

  const origin = request.headers.get('origin');
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      throw new Error('Ungültige Herkunft.');
    }
    return;
  }

  const referer = request.headers.get('referer');
  if (referer) {
    const refererHost = new URL(referer).host;
    if (refererHost !== host) {
      throw new Error('Ungültige Herkunft.');
    }
  }
};

