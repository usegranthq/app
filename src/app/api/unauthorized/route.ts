import { NextRequest, NextResponse } from 'next/server';

import constants from '@/constants';
import ROUTES from '@/constants/routes';
import { getSiteUrlFromRequest } from '@/lib/site';

export const GET = async (request: NextRequest) => {
  const redirectTo = new URL(ROUTES.LOGIN, getSiteUrlFromRequest(request));
  const response = NextResponse.redirect(redirectTo);
  response.cookies.delete(constants.SESSION_COOKIE);
  return response;
};
