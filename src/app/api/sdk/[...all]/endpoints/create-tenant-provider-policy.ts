import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { tenantProviderPolicySchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';
import { tokenProviderPolicyFields } from './utils/return-fields';

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

    const plan = await getPlanByUserId(ctx.context.userId);
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

    if (tenantProviderPoliciesCount >= plan.features.tenantProviderPolicies.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED);
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
      throw new SdkError('CONFLICT', ERRORS.TENANT_PROVIDER_POLICY_ALREADY_EXISTS);
    }

    try {
      const tenantProviderPolicy = await db.tenantProviderPolicy.create({
        data: {
          tenantProviderId,
          name: ctx.body.name,
          description: ctx.body.description,
          audience: ctx.body.audience,
          conditions: ctx.body.conditions,
        },
        select: tokenProviderPolicyFields,
      });

      return toSdkJsonResponse(tenantProviderPolicy, STATUS_CODES.CREATED);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);
export default createTenantProviderPolicy;
