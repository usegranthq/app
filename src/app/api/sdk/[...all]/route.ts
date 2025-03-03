import { NextRequest } from 'next/server';
import { createRouter } from 'better-call';

import { getBearerToken, unauthorizedResponse } from '@/utils/rest';
import { auth } from '@/lib/auth';

import endpoints from './endpoints';

const verifyApiKey = async (key: string): Promise<string | null> => {
  const result = await auth.api.verifyApiKey({
    body: {
      key,
    },
  });

  if (!result.valid || !result.key) {
    return null;
  }

  return result.key.userId;
};

const handler = async (request: NextRequest) => {
  const bearerToken = getBearerToken(request);
  if (!bearerToken) {
    return unauthorizedResponse('Missing api key');
  }

  const userId = await verifyApiKey(bearerToken);
  if (!userId) {
    return unauthorizedResponse('Unauthorized');
  }

  const router = createRouter(endpoints, {
    basePath: '/sdk',
    extraContext: {
      userId: userId,
    },
    openAPI: {
      disabled: true,
    },
  });

  return router.handler(request);
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
