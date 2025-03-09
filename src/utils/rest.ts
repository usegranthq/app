import { NextRequest } from 'next/server';

export const validateBearerToken = (request: NextRequest, secret?: string) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${secret}`;
};

export const hasBearerToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ');
};

export const getBearerToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  return authHeader?.split(' ')[1] ?? null;
};

export const unauthorizedResponse = (message = 'Unauthorized') => {
  return new Response(message, { status: 401 });
};

export const forbiddenResponse = (message = 'Forbidden') => {
  return new Response(message, { status: 403 });
};

export const rateLimitedResponse = (message = 'Rate limited', retryAfter?: number | null) => {
  const headers = new Headers();
  if (retryAfter) {
    headers.set('Retry-After', retryAfter.toString());
  }

  return new Response(message, {
    status: 429,
    headers,
  });
};
