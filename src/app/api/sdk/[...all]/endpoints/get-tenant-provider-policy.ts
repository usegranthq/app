import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getTenantProviderPolicy = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:tenantProviderId/policies/:policyId',
  {
    method: 'GET',
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
      select: {
        id: true,
        name: true,
        description: true,
        audience: true,
        conditions: true,
      },
    });

    if (!tenantProviderPolicy) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND);
    }

    return tenantProviderPolicy;
  },
);

export default getTenantProviderPolicy;
