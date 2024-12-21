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

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        providerId,
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
