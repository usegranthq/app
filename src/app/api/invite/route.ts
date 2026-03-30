import { NextRequest, NextResponse } from 'next/server';

import constants from '@/constants';
import ROUTES from '@/constants/routes';
import env from '@/env';
import { getSiteUrlFromRequest } from '@/lib/site';
import { safeCompare } from '@/utils/string';

export const GET = async (request: NextRequest) => {
  // get invite code from request query params
  const inviteCode = request.nextUrl.searchParams.get('code');
  if (!inviteCode) {
    return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
  }

  // check if invite code is valid
  if (!safeCompare(inviteCode, env.INVITE_TOKEN ?? '')) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL(ROUTES.LOGIN, getSiteUrlFromRequest(request)));
  response.cookies.set(constants.INVITE_COOKIE, inviteCode, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
};
