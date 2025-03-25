import { STATUS_CODES } from '@/utils/rest';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { tenantProviderSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';
import { tenantProviderFields } from './utils/return-fields';

const createTenantProvider = createAuthEndpoint(
  'v1/tenants/:tenantId/providers',
  {
    method: 'POST',
    body: tenantProviderSchema,
  },
  async (ctx) => {
    const { tenantId } = ctx.params;
    const { url, fingerprints, audience, earliestIssuanceTimeAllowed } = ctx.body;

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

    // check if tenant already exists
    const tenantExists = await db.tenantProvider
      .count({
        where: {
          tenantId,
          url: {
            equals: url,
            mode: 'insensitive',
          },
          Tenant: {
            userId: ctx.context.userId,
          },
        },
      })
      .then(Boolean);

    if (tenantExists) {
      throw new SdkError('CONFLICT', ERRORS.PROVIDER_ALREADY_EXISTS);
    }

    const tenantProvider = await db.tenantProvider.create({
      data: {
        tenantId,
        url,
        fingerprints,
        audience,
        earliestIssuanceTimeAllowed,
      },
      select: tenantProviderFields,
    });

    return toSdkJsonResponse(tenantProvider, STATUS_CODES.CREATED);
  },
);

export default createTenantProvider;
