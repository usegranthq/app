import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getProvider = createAuthEndpoint(
  'v1/providers/:id',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { id } = ctx.params;

    const provider = await db.provider.findUnique({
      where: {
        id,
        userId: ctx.context.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        urlId: true,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    return provider;
  },
);

export default getProvider;
