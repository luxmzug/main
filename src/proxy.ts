import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/constants';

const isLoginPath = (pathname: string) => {
  return (
    pathname === '/admin/login' ||
    pathname === '/admin/login/' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/login/'
  );
};

/**
 * Blocks unauthenticated admin page and API access before the Node handlers run.
 */
export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  const hasCookie = request.cookies.has(SESSION_COOKIE);
  if (pathname.startsWith('/admin') && !hasCookie) {
    return NextResponse.redirect(new URL('/admin/login/', request.url));
  }

  if (pathname.startsWith('/api/admin') && !hasCookie) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
