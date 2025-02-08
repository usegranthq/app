import { NextRequest, NextResponse } from 'next/server';

import ROUTES from '@/constants/routes';
import constants from '@/constants';

export const GET = async (request: NextRequest) => {
  const redirectTo = new URL(ROUTES.LOGIN, request.url);
  const response = NextResponse.redirect(redirectTo);
  response.cookies.delete(constants.SESSION_COOKIE);
  return response;
};
