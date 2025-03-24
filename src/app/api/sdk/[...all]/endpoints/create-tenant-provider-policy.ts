import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { tenantProviderPolicySchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const createTenantProviderPolicy = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:tenantProviderId/policies',
  {
    method: 'POST',
    body: tenantProviderPolicySchema,
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

    const plan = await getPlanByUserId(ctx.context.userId);
    const tenantsCount = await db.tenantProvider.count({
      where: {
        tenantId,
        Tenant: {
          userId: ctx.context.userId,
        },
      },
    });

    if (tenantsCount >= plan.features.tenantProviders.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_PROVIDERS_LIMIT_REACHED);
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

    // get tenant provider count
    const tenantProviderPoliciesCount = await db.tenantProviderPolicy.count({
      where: {
        tenantProviderId,
        TenantProvider: {
          tenantId,
          Tenant: {
            userId: ctx.context.userId,
          },
        },
      },
    });

    if (tenantProviderPoliciesCount >= plan.features.tenantProviders.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_TENANT_PROVIDERS_LIMIT_REACHED);
    }

    // check if tenant already exists
    const tenantProviderPolicyExists = await db.tenantProviderPolicy
      .count({
        where: {
          tenantProviderId,
          name: {
            equals: ctx.body.name,
            mode: 'insensitive',
          },
          TenantProvider: {
            id: {
              not: tenantProviderId,
            },
            Tenant: {
              userId: ctx.context.userId,
            },
          },
        },
      })
      .then(Boolean);

    if (tenantProviderPolicyExists) {
      throw new SdkError('CONFLICT', ERRORS.PROVIDER_POLICY_ALREADY_EXISTS);
    }

    const tenantProviderPolicy = await db.tenantProviderPolicy.create({
      data: {
        tenantProviderId,
        name: ctx.body.name,
        description: ctx.body.description,
        audience: ctx.body.audience,
        conditions: ctx.body.conditions,
      },
      select: {
        id: true,
        name: true,
        description: true,
        audience: true,
        conditions: true,
      },
    });

    return tenantProviderPolicy;
  },
);

export default createTenantProviderPolicy;
