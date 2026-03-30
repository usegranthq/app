import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';

const deleteClient = authRpcRouter.providers.clients.delete.handler(async ({ context, input, errors }) => {
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
  });

  if (!client) {
    throw errors.CLIENT_NOT_FOUND();
  }

  try {
    await db.client.delete({
      where: {
        id: clientId,
        providerId,
        Provider: {
          userId: context.userId,
        },
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({ message: errorMessage });
  }
});

export default deleteClient;
