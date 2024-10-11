import { decodeJwt } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isNullOrUndefined } from '@/utils/validators';
import { AUTH_COOKIE_NAME, VERIFY_COOKIE_NAME } from '@/constants/cookies';

const isProtectedRoute = (pathname: string) => pathname.startsWith('/u');

const redirectToLoginPage = (request: NextRequest) => {
  return NextResponse.redirect(new URL('/login', request.url));
};

const isTokenExpired = (expirationTime?: number) => {
  if (isNullOrUndefined(expirationTime)) return true;
  return new Date() > new Date(expirationTime * 1000);
};

const hasValidCookie = (request: NextRequest, cookieName: string) => {
  const cookie = request.cookies.get(cookieName);
  if (!cookie) return false;

  const claims = decodeJwt(cookie.value as string);
  return !isTokenExpired(claims.exp);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasValidCookie(request, AUTH_COOKIE_NAME);
  const isVerifyCookieValid = hasValidCookie(request, VERIFY_COOKIE_NAME);

  if (isAuthenticated && !isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/u', request.url));
  }

  if (pathname === '/verify') {
    return isVerifyCookieValid ? NextResponse.next() : redirectToLoginPage(request);
  }

  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return redirectToLoginPage(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
