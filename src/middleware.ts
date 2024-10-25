import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

import { isNullOrUndefined } from '@/utils/validators';
import * as constants from '@/constants';
import api from './lib/api';

const isProtectedRoute = (pathname: string) => pathname.startsWith('/u');

const redirectToPage = (path: string, request: NextRequest) => NextResponse.redirect(new URL(path, request.url));
const redirectToLoginPage = (request: NextRequest) => redirectToPage('/login', request);
const redirectToUserPage = (request: NextRequest) => redirectToPage('/u', request);

const isTokenExpired = (expirationTime?: number) => {
  if (isNullOrUndefined(expirationTime)) return true;
  return new Date() > new Date(expirationTime * 1000);
};

const hasValidCookie = (request: NextRequest, cookieName: string) => {
  const cookie = request.cookies.get(cookieName);
  if (!cookie?.value) return false;

  const claims = decodeJwt(cookie.value as string);
  return !isTokenExpired(claims.exp);
};

const next = () => NextResponse.next();

const validateUserSession = async () => {
  try {
    await api.get('v1/u/refresh');
  } catch {
    return false;
  }
  return true;
};

const handleProtectedRoute = async (request: NextRequest) => {
  const cookieStore = await cookies();

  const isAuthCookieValid = hasValidCookie(request, constants.AUTH_COOKIE);
  if (!isAuthCookieValid) return redirectToLoginPage(request);

  const isUserValid = await validateUserSession();

  if (!isUserValid) {
    const response = redirectToLoginPage(request);
    response.cookies.delete(constants.AUTH_COOKIE);
    return response;
  }

  if (request.nextUrl.pathname === '/u') {
    const recentProjectId = cookieStore.get(constants.RECENT_PROJECT_COOKIE)?.value;
    if (recentProjectId) {
      return redirectToPage(`/u/projects/${recentProjectId}`, request);
    }

    return redirectToPage('/u/projects', request);
  }

  return next();
};

const handleVerifyRoute = (request: NextRequest) => {
  const isVerifyCookieValid = hasValidCookie(request, constants.VERIFY_COOKIE);

  if (!isVerifyCookieValid) {
    const response = redirectToLoginPage(request);
    response.cookies.delete(constants.VERIFY_COOKIE);
    return response;
  }

  return next();
};

const authRoutes = ['/login', '/verify'];

const handleDefaultRoute = (request: NextRequest) => {
  const isAuthCookieValid = hasValidCookie(request, constants.AUTH_COOKIE);
  if (!isAuthCookieValid) return next();

  return authRoutes.includes(request.nextUrl.pathname) ? redirectToUserPage(request) : next();
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedRoute(pathname)) {
    return handleProtectedRoute(request);
  } else if (pathname.startsWith('/verify')) {
    return handleVerifyRoute(request);
  }

  return handleDefaultRoute(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
