import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { clientFields } from './utils/return-fields';

const listClients = createAuthEndpoint(
  'v1/providers/:providerId/clients',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { providerId } = ctx.params;

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

    const clients = await db.client.findMany({
      where: {
        providerId,
        Provider: {
          userId: ctx.context.userId,
        },
      },
      select: clientFields,
    });

    return clients;
  },
);

export default listClients;
