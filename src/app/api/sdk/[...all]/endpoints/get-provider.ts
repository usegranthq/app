import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { providerFields } from './utils/return-fields';

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
      select: providerFields,
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    return provider;
  },
);

export default getProvider;
