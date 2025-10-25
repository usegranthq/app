import z from 'zod';

import db from '@/lib/db';
import { conditionsSchema } from '@/schema';

import { authRpcRouter } from '../rpc';
import { tokenProviderPolicyFields } from './utils/return-fields';

const getTenantProviderPolicy = authRpcRouter.tenants.providers.policies.get.handler(
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
      select: tokenProviderPolicyFields,
    });

    if (!tenantProviderPolicy) {
      throw errors.TENANT_PROVIDER_POLICY_NOT_FOUND();
    }

    return {
      ...tenantProviderPolicy,
      conditions: (tenantProviderPolicy.conditions as z.infer<typeof conditionsSchema>[]) || [],
    };
  },
);

export default getTenantProviderPolicy;
