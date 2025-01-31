import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { tenantProviderSchema } from '@/schema';

const createTenantProvider = createAuthEndpoint(
  'v1/tenants/:tenantId/providers',
  {
    method: 'POST',
    body: tenantProviderSchema,
  },
  async (ctx) => {
    const { tenantId } = ctx.params;
    const { url, fingerprint, audience, earliestIssuanceTimeAllowed } = ctx.body;

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
