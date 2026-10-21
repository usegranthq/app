import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';
import { clientFields } from './utils/return-fields';

const createClient = authRpcRouter.providers.clients.create.handler(async ({ context, input, errors }) => {
  const { name, audience } = input;

  // Check if provider exists
  const provider = await db.provider.findUnique({
    where: {
      id: input.providerId,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  // check if client already exists
  const existingClient = await db.client.findFirst({
    where: {
      name,
      providerId: input.providerId,
      Provider: {
        userId: context.userId,
      },
    },
  });
  if (existingClient) {
    throw errors.CLIENT_ALREADY_EXISTS();
  }

  try {
    const client = await db.client.create({
      data: {
        name,
        audience,
        providerId: input.providerId,
      },
      select: clientFields,
    });

    return client;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');

    throw errors.INTERNAL_SERVER_ERROR({
      message: errorMessage,
    });
  }
});

export default createClient;
