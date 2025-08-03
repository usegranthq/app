import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { clientFields } from './utils/return-fields';

const listClients = authRpcRouter.providers.clients.list.handler(async ({ context, input, errors }) => {
  const { providerId } = input;

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

  const clients = await db.client.findMany({
    where: {
      providerId,
      Provider: {
        userId: context.userId,
      },
    },
    select: clientFields,
  });

  return clients;
});

export default listClients;
