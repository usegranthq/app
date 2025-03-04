import { getApiErrorMessage } from '@/utils/error';
import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const deleteClient = createAuthEndpoint(
  'v1/providers/:providerId/clients/:clientId',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { providerId, clientId } = ctx.params;

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        providerId,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });

    if (!client) {
      throw new SdkError('NOT_FOUND', ERRORS.CLIENT_NOT_FOUND);
    }

    try {
      await db.client.delete({
        where: {
          id: clientId,
          providerId,
          Provider: {
            userId: ctx.context.userId,
          },
        },
      });

      return {};
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default deleteClient;
