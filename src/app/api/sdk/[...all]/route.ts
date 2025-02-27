import { NextRequest } from 'next/server';
import { createRouter } from 'better-call';

import db from '@/lib/db';
import { getPlanByUserId } from '@/utils/billing';
import { forbiddenResponse, getBearerToken, unauthorizedResponse } from '@/utils/rest';
import { User } from '@/types';

import endpoints from './endpoints';

const verifyToken = async (bearerToken: string): Promise<User | null> => {
  const token = await db.token.findUnique({
    where: {
      token: bearerToken,
    },
    include: {
      User: true,
    },
  });

  if (!token) {
    return null;
  }

  if (token.expiresAt && token.expiresAt < new Date()) {
    return null;
  }

  return token.User;
};

const handler = async (request: NextRequest) => {
  const bearerToken = getBearerToken(request);
  if (!bearerToken) {
    return unauthorizedResponse('Missing api token');
  }

  const user = await verifyToken(bearerToken);
  if (!user) {
    return unauthorizedResponse('Unauthorized');
  }

  const plan = await getPlanByUserId(user.id);

  if (!plan.apiAccess) {
    return forbiddenResponse('Your current plan does not include API access. Please upgrade.');
  }

  const router = createRouter(endpoints, {
    basePath: '/sdk',
    extraContext: {
      userId: user.id,
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
