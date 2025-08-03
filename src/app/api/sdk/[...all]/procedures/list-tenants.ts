import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { tenantFields } from './utils/return-fields';

const listTenants = authRpcRouter.tenants.list.handler(async ({ context }) => {
  const tenants = await db.tenant.findMany({
    where: {
      userId: context.userId,
    },
    select: tenantFields,
  });

  return tenants;
});

export default listTenants;
