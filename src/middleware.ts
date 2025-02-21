import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth';

import * as constants from '@/constants';

import ROUTES from './constants/routes';
import { env, isDev } from './env';

const isProtectedRoute = (pathname: string) => pathname.startsWith('/u');

const redirectToPage = (path: string, request: NextRequest) => NextResponse.redirect(new URL(path, request.url));
const redirectToLoginPage = (request: NextRequest) => redirectToPage(ROUTES.LOGIN, request);
const redirectToUserPage = (request: NextRequest) => redirectToPage(ROUTES.DASHBOARD, request);

const hasValidCookie = (request: NextRequest, cookieName: string) => {
  const cookie = request.cookies.get(cookieName);
  if (!cookie?.value) return false;

  return true;
};

const getNonce = (protectedRoute: boolean) => {
  if (!protectedRoute) {
    return env.BUILD_HASH;
  }

  return Buffer.from(crypto.randomUUID()).toString('base64');
};

const next = (request: NextRequest, protectedRoute = false) => {
  const nonce = getNonce(protectedRoute);

  // see https://web.dev/strict-csp for strict CSP reference
  const cspHeader = `
      script-src ${isDev ? `http: https: 'unsafe-inline'` : `'nonce-${nonce}' 'strict-dynamic'`};
      object-src 'none';
      base-uri 'none';
      upgrade-insecure-requests;
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
};

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

  return next(request, true);
};

const handleVerifyRoute = (request: NextRequest) => {
  const isVerifyCookieValid = hasValidCookie(request, constants.VERIFY_COOKIE);

  if (!isVerifyCookieValid) {
    const response = redirectToLoginPage(request);
    response.cookies.delete(constants.VERIFY_COOKIE);
    return response;
  }

  return next(request);
};

const authRoutes = [ROUTES.LOGIN, '/verify'];

const handleDefaultRoute = (request: NextRequest) => {
  const hasSession = hasValidSessionCookie(request);
  if (!hasSession) return next(request);

  return authRoutes.includes(request.nextUrl.pathname) ? redirectToUserPage(request) : next(request);
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
