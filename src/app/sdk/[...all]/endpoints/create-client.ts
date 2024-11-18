import { APIError } from 'better-call';

import db from '@/lib/db';
import { clientSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import { getApiErrorMessage } from '@/utils/error';

const createClient = createAuthEndpoint(
  'v1/projects/:id/clients',
  {
    method: 'POST',
    body: clientSchema,
  },
  async (ctx) => {
    const { name, audience } = ctx.body;

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
