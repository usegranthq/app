import { getApiErrorMessage } from '@/utils/error';
import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const deleteProvider = createAuthEndpoint(
  'v1/providers/:id',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { id } = ctx.params;

    const provider = await db.provider.findUnique({
      where: {
        id,
        userId: ctx.context.userId,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    try {
      await db.provider.delete({
        where: {
          id,
          userId: ctx.context.userId,
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

export default deleteProvider;
