import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import { tenantFields } from './utils/return-fields';

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
      select: tenantFields,
    });

    return tenants;
  },
);

export default listTenants;
