import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import { providerFields } from './utils/return-fields';

const listProviders = createAuthEndpoint(
  'v1/providers',
  {
    method: 'GET',
  },
  async (ctx) => {
    const providers = await db.provider.findMany({
      where: {
        userId: ctx.context.userId,
      },
      select: providerFields,
    });

    return providers;
  },
);

export default listProviders;
