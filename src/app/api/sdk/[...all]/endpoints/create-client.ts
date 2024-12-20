import { APIError } from 'better-call';

import db from '@/lib/db';
import { clientSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import { getApiErrorMessage } from '@/utils/error';
import { getPlanByUserId } from '@/lib/auth';

const createClient = createAuthEndpoint(
  'v1/projects/:id/clients',
  {
    method: 'POST',
    body: clientSchema,
  },
  async (ctx) => {
    const { name, audience } = ctx.body;

    const plan = await getPlanByUserId(ctx.context.userId);
    const clientsCount = await db.client.count({
      where: {
        projectId: ctx.context.userId,
      },
    });

    if (clientsCount >= plan.clients) {
      throw new APIError('FORBIDDEN', {
        message: 'You have reached the limit for clients. Upgrade your plan or contact support to increase the limit.',
      });
    }

    try {
      const client = await db.client.create({
        data: {
          name,
          audience,
          projectId: ctx.params.id,
        },
        select: {
          id: true,
          name: true,
          audience: true,
        },
      });

      return client;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      return new APIError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createClient;
