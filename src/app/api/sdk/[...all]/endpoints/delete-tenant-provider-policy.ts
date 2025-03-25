import { getApiErrorMessage } from '@/utils/error';
import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const deleteTenantProviderPolicy = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:tenantProviderId/policies/:policyId',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { tenantId, tenantProviderId, policyId } = ctx.params;

    // Check if tenant exists
    const tenant = await db.tenant.findUnique({
      where: {
        id: tenantId,
        userId: ctx.context.userId,
      },
    });

    if (!tenant) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_NOT_FOUND);
    }

    // get tenant provider
    const tenantProvider = await db.tenantProvider.findUnique({
      where: {
        id: tenantProviderId,
        tenantId,
        Tenant: {
          userId: ctx.context.userId,
        },
      },
    });

    if (!tenantProvider) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_PROVIDER_NOT_FOUND);
    }

    // check if tenant provider policy exists
    const tenantProviderPolicy = await db.tenantProviderPolicy.findUnique({
      where: {
        id: policyId,
        tenantProviderId,
        TenantProvider: {
          tenantId,
          Tenant: {
            userId: ctx.context.userId,
          },
        },
      },
    });

    if (!tenantProviderPolicy) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND);
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
              userId: ctx.context.userId,
            },
          },
        },
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }

    return {};
  },
);

export default deleteTenantProviderPolicy;
