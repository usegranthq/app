import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import db from '@/lib/db';
import vercel from '@/lib/vercel';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';

const deleteDomain = createAuthEndpoint(
  'v1/providers/:id/domains/:domainId',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    // Check if provider exists
    const provider = await db.provider.findUnique({
      where: {
        id: ctx.params.id,
        userId: ctx.context.userId,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    // check if domain exists
    const domain = await db.domain.findUnique({
      where: {
        id: ctx.params.domainId,
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });

    if (!domain) {
      throw new SdkError('NOT_FOUND', ERRORS.DOMAIN_NOT_FOUND);
    }

    try {
      await vercel.domains.delete(domain.domain);
      await db.domain.delete({
        where: {
          domain: domain.domain,
          providerId: ctx.params.id,
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

    return toSdkJsonResponse(null, STATUS_CODES.NO_CONTENT);
  },
);

export default deleteDomain;
