import { z } from 'zod/v4';

import db from '@/lib/db';
import { conditionsSchema } from '@/schema';

import { authRpcRouter } from '../rpc';
import { tokenProviderPolicyFields } from './utils/return-fields';

const listTenantProviderPolicies = authRpcRouter.tenants.providers.policies.list.handler(
  async ({ context, input, errors }) => {
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
    const tenantProviderPolicies = await db.tenantProviderPolicy.findMany({
      where: {
        tenantProviderId,
        TenantProvider: {
          tenantId,
          Tenant: {
            userId: context.userId,
          },
        },
      },
      select: tokenProviderPolicyFields,
    });

    return tenantProviderPolicies.map((tenantProviderPolicy) => ({
      ...tenantProviderPolicy,
      conditions: (tenantProviderPolicy.conditions as z.infer<typeof conditionsSchema>[]) || [],
    }));
  },
);

export default listTenantProviderPolicies;
