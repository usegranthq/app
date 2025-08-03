import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { tenantFields } from './utils/return-fields';

const getTenant = authRpcRouter.tenants.get.handler(async ({ context, input, errors }) => {
  const { id } = input;

  const tenant = await db.tenant.findUnique({
    where: {
      id,
      userId: context.userId,
    },
    select: tenantFields,
  });

  if (!tenant) {
    throw errors.TENANT_NOT_FOUND();
  }

  return tenant;
});

export default getTenant;
