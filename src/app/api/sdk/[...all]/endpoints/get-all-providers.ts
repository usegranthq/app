import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';

const getAllProviders = createAuthEndpoint(
  'v1/providers',
  {
    method: 'GET',
  },
  async (ctx) => {
    const providers = await db.provider.findMany({
      where: {
        userId: ctx.context.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        urlId: true,
      },
    });

    return providers;
  },
);

export default getAllProviders;
