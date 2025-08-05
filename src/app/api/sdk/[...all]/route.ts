import { NextRequest } from 'next/server';

import handler from './handler';

export async function handleRequest(request: NextRequest) {
  const { response, matched } = await handler.handle(request, {
    prefix: '/api/sdk',
    context: {
      headers: request.headers,
    },
  });

  if (!matched) {
    return new Response('Not found', { status: 404 });
  }

  return response;
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
