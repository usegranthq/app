import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { clientFields } from './utils/return-fields';

const getClient = authRpcRouter.providers.clients.get.handler(async ({ context, input, errors }) => {
  const { providerId, clientId } = input;

  // Check if provider exists
  const provider = await db.provider.findUnique({
    where: {
      id: providerId,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  const client = await db.client.findUnique({
    where: {
      id: clientId,
      providerId,
      Provider: {
        userId: context.userId,
      },
    },
    select: clientFields,
  });

  if (!client) {
    throw errors.CLIENT_NOT_FOUND();
  }

  return client;
});

export default getClient;
