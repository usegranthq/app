import { getApiErrorMessage } from '@/utils/error';
import db from '@/lib/db';

import { authRpcRouter } from '../rpc';

const deleteTenantProvider = authRpcRouter.tenants.providers.delete.handler(async ({ context, input, errors }) => {
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

  const tenantProvider = await db.tenantProvider.findUnique({
    where: {
      id: tenantProviderId,
      tenantId,
      Tenant: {
        userId: context.userId,
      },
    },
  });

  if (!tenantProvider) {
    throw errors.TENANT_PROVIDER_NOT_FOUND();
  }

  try {
    await db.tenantProvider.delete({
      where: {
        id: tenantProviderId,
        tenantId,
        Tenant: {
          userId: context.userId,
        },
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({
      message: errorMessage,
    });
  }
});

export default deleteTenantProvider;
