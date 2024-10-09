import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('auth')?.value;
  const { pathname } = request.nextUrl;

  if (currentUser && !pathname.startsWith('/u')) {
    return NextResponse.redirect(new URL('/u', request.url));
  }

  if (!currentUser && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
