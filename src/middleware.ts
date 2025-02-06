import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth';

import * as constants from '@/constants';

import ROUTES from './constants/routes';
import { env } from './env';

const isProtectedRoute = (pathname: string) => pathname.startsWith('/u');

const redirectToPage = (path: string, request: NextRequest) => NextResponse.redirect(new URL(path, request.url));
const redirectToLoginPage = (request: NextRequest) => redirectToPage(ROUTES.LOGIN, request);
const redirectToUserPage = (request: NextRequest) => redirectToPage(ROUTES.DASHBOARD, request);

const hasValidCookie = (request: NextRequest, cookieName: string) => {
  const cookie = request.cookies.get(cookieName);
  if (!cookie?.value) return false;

  return true;
};

const next = () => NextResponse.next();

const hasValidSessionCookie = (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request, { cookiePrefix: constants.COOKIE_PREFIX });
  return !!sessionCookie;
};

const handleProtectedRoute = async (request: NextRequest) => {
  const hasSession = hasValidSessionCookie(request);
  if (!hasSession) {
    return redirectToLoginPage(request);
  }

  if (request.nextUrl.pathname === '/u') {
    return redirectToPage(ROUTES.PROVIDERS, request);
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

const authRoutes = [ROUTES.LOGIN, '/verify'];

const handleDefaultRoute = (request: NextRequest) => {
  const hasSession = hasValidSessionCookie(request);
  if (!hasSession) return next();

  return authRoutes.includes(request.nextUrl.pathname) ? redirectToUserPage(request) : next();
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const inviteToken = env.INVITE_TOKEN;

  // @todo: remove this after invite code is removed
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/login') && inviteToken) {
    const inviteCookie = request.cookies.get(constants.INVITE_COOKIE);
    if (!inviteCookie || inviteCookie.value !== inviteToken) {
      return redirectToPage(ROUTES.LANDING, request);
    }
  }

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
