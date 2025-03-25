import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';

const deleteClient = createAuthEndpoint(
  'v1/providers/:providerId/clients/:clientId',
  {
    method: 'DELETE',
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
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }

    return toSdkJsonResponse({}, STATUS_CODES.NO_CONTENT);
  },
);

export default deleteClient;
