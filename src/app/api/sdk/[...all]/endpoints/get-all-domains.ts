import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getAllDomains = createAuthEndpoint(
  'v1/providers/:providerId/domains',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { providerId } = ctx.params;

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

    const domains = await db.domain.findMany({
      where: {
        providerId,
        Provider: {
          userId: ctx.context.userId,
        },
      },
      select: {
        id: true,
        domain: true,
        verified: true,
      },
    });

    return domains;
  },
);

export default getAllDomains;
