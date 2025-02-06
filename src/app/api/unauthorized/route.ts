import { NextRequest, NextResponse } from 'next/server';

import constants from '@/constants';
import ROUTES from '@/constants/routes';

export const GET = async (request: NextRequest) => {
  const redirectTo = new URL(ROUTES.LOGIN, request.url);
  const response = NextResponse.redirect(redirectTo);
  response.cookies.delete(constants.SESSION_COOKIE);
  return response;
};
