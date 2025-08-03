import { NextRequest } from 'next/server';

import handler from './handler';

export async function handleRequest(request: NextRequest) {
  const { response } = await handler.handle(request, {
    prefix: '/sdk',
    context: {
      headers: request.headers,
    },
  });

  return response ?? new Response('Not found', { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
