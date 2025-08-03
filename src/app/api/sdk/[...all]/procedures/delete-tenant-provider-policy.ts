import { getApiErrorMessage } from '@/utils/error';
import db from '@/lib/db';

import { authRpcRouter } from '../rpc';

const deleteTenantProviderPolicy = authRpcRouter.tenants.providers.policies.delete.handler(
  async ({ context, input, errors }) => {
    const { tenantId, tenantProviderId, policyId } = input;

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

    // get tenant provider
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

    // check if tenant provider policy exists
    const tenantProviderPolicy = await db.tenantProviderPolicy.findUnique({
      where: {
        id: policyId,
        tenantProviderId,
        TenantProvider: {
          tenantId,
          Tenant: {
            userId: context.userId,
          },
        },
      },
    });

    if (!tenantProviderPolicy) {
      throw errors.TENANT_PROVIDER_POLICY_NOT_FOUND();
    }

    try {
      // delete tenant provider policy
      await db.tenantProviderPolicy.delete({
        where: {
          id: policyId,
          tenantProviderId,
          TenantProvider: {
            tenantId,
            Tenant: {
              userId: context.userId,
            },
          },
        },
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw errors.INTERNAL_SERVER_ERROR({
        message: errorMessage,
      });
    }
  },
);

export default deleteTenantProviderPolicy;
