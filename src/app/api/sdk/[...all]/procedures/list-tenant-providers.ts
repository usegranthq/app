import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { tenantProviderFields } from './utils/return-fields';

const listTenantProviders = authRpcRouter.tenants.providers.list.handler(async ({ context, input, errors }) => {
  const { tenantId } = input;

  // Check if tenant exists
  const tenant = await db.tenant.findUnique({
    where: {
      id: tenantId,
      userId: context.userId,
    },
  });

  if (!tenant) {
    throw errors.TENANT_NOT_FOUND();
  }

  const tenantProviders = await db.tenantProvider.findMany({
    where: {
      tenantId,
      Tenant: {
        userId: context.userId,
      },
    },
    select: tenantProviderFields,
  });

  return tenantProviders;
});

export default listTenantProviders;
