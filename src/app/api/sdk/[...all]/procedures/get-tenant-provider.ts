import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { tenantProviderFields } from './utils/return-fields';

const getTenantProvider = authRpcRouter.tenants.providers.get.handler(async ({ context, input, errors }) => {
  const { tenantId, tenantProviderId } = input;

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

  const tenantProvider = await db.tenantProvider.findFirst({
    where: {
      id: tenantProviderId,
      tenantId,
      Tenant: {
        userId: context.userId,
      },
    },
    select: tenantProviderFields,
  });

  if (!tenantProvider) {
    throw errors.TENANT_PROVIDER_NOT_FOUND();
  }

  return tenantProvider;
});

export default getTenantProvider;
