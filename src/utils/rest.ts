import { NextRequest } from 'next/server';

export const validateBearerToken = (request: NextRequest, secret?: string) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${secret}`;
};
