import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { tokenProviderPolicyFields } from './utils/return-fields';

const listTenantProviderPolicies = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:tenantProviderId/policies',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { tenantId, tenantProviderId } = ctx.params;

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
    const tenantProviderPolicies = await db.tenantProviderPolicy.findMany({
      where: {
        tenantProviderId,
        TenantProvider: {
          tenantId,
          Tenant: {
            userId: ctx.context.userId,
          },
        },
      },
      select: tokenProviderPolicyFields,
    });

    return tenantProviderPolicies;
  },
);

export default listTenantProviderPolicies;
