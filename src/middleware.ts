import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isProtectedPath = (pathname: string) => pathname.startsWith('/u');

const redirectToLogin = (request: NextRequest) => {
  return NextResponse.redirect(new URL('/login', request.url));
};

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth')?.value;
  const verifyCookie = request.cookies.get('verify')?.value;
  const { pathname } = request.nextUrl;

  if (authCookie && !isProtectedPath(pathname)) {
    return NextResponse.redirect(new URL('/u', request.url));
  }

  if (pathname === '/verify') {
    if (!verifyCookie) {
      return redirectToLogin(request);
    }

    return NextResponse.next();
  }

  if (!authCookie && isProtectedPath(pathname)) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
