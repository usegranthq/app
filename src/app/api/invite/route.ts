import { NextRequest, NextResponse } from 'next/server';

import ROUTES from '@/constants/routes';
import constants from '@/constants';
import { env } from '@/env';

export const GET = async (request: NextRequest) => {
  // get invite code from request query params
  const inviteCode = request.nextUrl.searchParams.get('code');
  if (!inviteCode) {
    return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
  }

  // check if invite code is valid
  if (inviteCode !== env.INVITE_TOKEN) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  response.cookies.set(constants.INVITE_COOKIE, inviteCode, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
};
