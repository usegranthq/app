import z from 'zod';

import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { conditionsSchema } from '@/schema';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';
import { tokenProviderPolicyFields } from './utils/return-fields';

const createTenantProviderPolicy = authRpcRouter.tenants.providers.policies.create.handler(
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

    const plan = await getPlanByUserId(context.userId);
    // get tenant provider count
    const tenantProviderPoliciesCount = await db.tenantProviderPolicy.count({
      where: {
        tenantProviderId,
        TenantProvider: {
          tenantId,
          Tenant: {
            userId: context.userId,
          },
        },
      },
    });

    if (tenantProviderPoliciesCount >= plan.features.tenantProviderPolicies.limit) {
      throw errors.MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED();
    }

    // check if tenant already exists
    const tenantProviderPolicyExists = await db.tenantProviderPolicy
      .count({
        where: {
          tenantProviderId,
          name: {
            equals: input.name,
            mode: 'insensitive',
          },
          TenantProvider: {
            id: {
              not: tenantProviderId,
            },
            Tenant: {
              userId: context.userId,
            },
          },
        },
      })
      .then(Boolean);

    if (tenantProviderPolicyExists) {
      throw errors.TENANT_PROVIDER_POLICY_ALREADY_EXISTS();
    }

    try {
      const tenantProviderPolicy = await db.tenantProviderPolicy.create({
        data: {
          tenantProviderId,
          name: input.name,
          description: input.description,
          audience: input.audience,
          conditions: input.conditions,
        },
        select: tokenProviderPolicyFields,
      });

      return {
        ...tenantProviderPolicy,
        conditions: (tenantProviderPolicy.conditions as z.infer<typeof conditionsSchema>[]) || [],
      };
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw errors.INTERNAL_SERVER_ERROR({
        message: errorMessage,
      });
    }
  },
);
export default createTenantProviderPolicy;
