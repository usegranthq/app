import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { domainFields } from './utils/return-fields';

const getDomain = createAuthEndpoint(
  'v1/providers/:id/domains/:domainId',
  {
    method: 'GET',
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
      select: domainFields,
    });

    if (!domain) {
      throw new SdkError('NOT_FOUND', ERRORS.DOMAIN_NOT_FOUND);
    }

    return domain;
  },
);

export default getDomain;
