import { NextRequest } from 'next/server';
import { createRouter } from 'better-call';

import { getBearerToken, unauthorizedResponse } from '@/utils/rest';

import endpoints from './endpoints';
import db from '@/lib/db';

const verifyToken = async (bearerToken: string): Promise<string | null> => {
  const token = await db.token.findUnique({
    where: {
      token: bearerToken,
    },
  });

  if (!token) {
    return null;
  }

  if (token.expiresAt && token.expiresAt < new Date()) {
    return null;
  }

  return token.userId;
};

const handler = async (request: NextRequest) => {
  const bearerToken = getBearerToken(request);
  if (!bearerToken) {
    return unauthorizedResponse('Missing api token');
  }

  const userId = await verifyToken(bearerToken);
  if (!userId) {
    return unauthorizedResponse('Unauthorized');
  }

  const router = createRouter(endpoints, {
    basePath: '/sdk',
    extraContext: {
      userId,
    },
  });

  return router.handler(request);
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
