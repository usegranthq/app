import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';

const listTenants = createAuthEndpoint(
  'v1/tenants',
  {
    method: 'GET',
  },
  async (ctx) => {
    const tenants = await db.tenant.findMany({
      where: {
        userId: ctx.context.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return tenants;
  },
);

export default listTenants;
