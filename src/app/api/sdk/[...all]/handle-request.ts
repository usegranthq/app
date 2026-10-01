import { NextRequest } from 'next/server';

import handler from './handler';

export async function handleRequest(request: NextRequest) {
  // serve under / for sdk.usegrant.dev
  // or under /api/sdk for other hosts
  const isSdkHost = request.headers.get('x-forwarded-host') === 'sdk.usegrant.dev';

  const { response, matched } = await handler.handle(request, {
    prefix: isSdkHost ? '/' : '/api/sdk',
    context: {
      headers: request.headers,
    },
  });

  if (!matched) {
    return new Response('Not found', { status: 404 });
  }

  return response;
}
