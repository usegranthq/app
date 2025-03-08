import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getClient = createAuthEndpoint(
  'v1/providers/:providerId/clients/:clientId',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { providerId, clientId } = ctx.params;

    // Check if provider exists
    const provider = await db.provider.findUnique({
      where: {
        id: providerId,
        userId: ctx.context.userId,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        providerId,
        Provider: {
          userId: ctx.context.userId,
        },
      },
      select: {
        id: true,
        name: true,
        audience: true,
      },
    });

    if (!client) {
      throw new SdkError('NOT_FOUND', ERRORS.CLIENT_NOT_FOUND);
    }

    return client;
  },
);

export default getClient;
