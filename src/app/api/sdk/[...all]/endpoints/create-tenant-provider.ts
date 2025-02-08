import { getPlanByUserId } from '@/lib/auth';
import db from '@/lib/db';
import { tenantProviderSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const createTenantProvider = createAuthEndpoint(
  'v1/tenants/:tenantId/providers',
  {
    method: 'POST',
    body: tenantProviderSchema,
  },
  async (ctx) => {
    const { tenantId } = ctx.params;
    const { url, fingerprint, audience, earliestIssuanceTimeAllowed } = ctx.body;

    const plan = await getPlanByUserId(ctx.context.userId);
    const tenantsCount = await db.tenantProvider.count({
      where: {
        tenantId,
      },
    });

    if (tenantsCount >= plan.tenants.providers) {
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
        fingerprints: [fingerprint],
        audience,
        earliestIssuanceTimeAllowed,
      },
    });

    return tenantProvider;
  },
);

export default createTenantProvider;
