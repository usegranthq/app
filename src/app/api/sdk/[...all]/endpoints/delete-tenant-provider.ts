import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const deleteTenantProvider = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:providerId',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { tenantId, providerId } = ctx.params;

    const tenantProvider = await db.tenantProvider.delete({
      where: {
        id: providerId,
        tenantId,
        Tenant: {
          userId: ctx.context.userId,
        },
      },
    });

    if (!tenantProvider) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_PROVIDER_NOT_FOUND);
    }

    return tenantProvider;
  },
);

export default deleteTenantProvider;
