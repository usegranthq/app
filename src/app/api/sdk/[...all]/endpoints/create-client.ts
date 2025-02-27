import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';
import { clientSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const createClient = createAuthEndpoint(
  'v1/providers/:id/clients',
  {
    method: 'POST',
    body: clientSchema,
  },
  async (ctx) => {
    const { name, audience } = ctx.body;

    const plan = await getPlanByUserId(ctx.context.userId);
    const clientsCount = await db.client.count({
      where: {
        providerId: ctx.params.id,
      },
    });

    if (clientsCount >= plan.providers.clients) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_CLIENTS_LIMIT_REACHED);
    }

    try {
      const client = await db.client.create({
        data: {
          name,
          audience,
          providerId: ctx.params.id,
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

      return new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createClient;
