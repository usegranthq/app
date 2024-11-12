import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { Session } from 'better-auth/types';
import ky, { HTTPError, Options as KyOptions } from 'ky';

import * as constants from '@/constants';

import ROUTES from './constants/routes';

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

const getSession = async (request: NextRequest, cookie: string): Promise<Session | null> => {
  const cookieStore = await cookies();

  const options: KyOptions = {
    prefixUrl: request.nextUrl.origin,
    headers: {
      cookie,
    },
  };

  try {
    return await ky.get<Session>('api/auth/get-session', options).json<Session>();
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 401) {
      cookieStore.delete(constants.AUTH_COOKIE);
      cookieStore.delete(constants.VERIFY_COOKIE);
      return null;
    }

    return null;
  }
};

const handleProtectedRoute = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(constants.AUTH_COOKIE);

  if (!authCookie) return redirectToLoginPage(request);

  const session = await getSession(request, cookieStore.toString());
  if (!session) {
    return redirectToLoginPage(request);
  }

  if (request.nextUrl.pathname === '/u') {
    const recentProjectId = cookieStore.get(constants.RECENT_PROJECT_COOKIE)?.value;
    if (recentProjectId) {
      return redirectToPage(`/u/projects/${recentProjectId}`, request);
    }

    return redirectToPage(ROUTES.PROJECTS, request);
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
