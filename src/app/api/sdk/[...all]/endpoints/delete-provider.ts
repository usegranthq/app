import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import db from '@/lib/db';
import vercel from '@/lib/vercel';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';

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
      // delete all domains
      const domains = await db.domain.findMany({
        where: {
          providerId: id,
          Provider: { userId: ctx.context.userId },
        },
      });

      for (const domain of domains) {
        await vercel.domains.delete(domain.domain);
        await db.domain.delete({ where: { id: domain.id, Provider: { userId: ctx.context.userId } } });
      }

      await db.provider.delete({
        where: {
          id,
          userId: ctx.context.userId,
        },
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }

    return toSdkJsonResponse(null, STATUS_CODES.NO_CONTENT);
  },
);

export default deleteProvider;
