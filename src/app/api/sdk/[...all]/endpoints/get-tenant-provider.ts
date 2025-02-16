import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getTenantProvider = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:providerId',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { tenantId, providerId } = ctx.params;

    const tenantProvider = await db.tenantProvider.findFirst({
      where: {
        id: providerId,
        tenantId,
      },
    });

    if (!tenantProvider) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_PROVIDER_NOT_FOUND);
    }

    return tenantProvider;
  },
);

export default getTenantProvider;
