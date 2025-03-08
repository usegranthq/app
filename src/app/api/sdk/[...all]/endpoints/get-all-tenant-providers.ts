import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getAllTenantProviders = createAuthEndpoint(
  'v1/tenants/:tenantId/providers',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { tenantId } = ctx.params;

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

    const tenantProviders = await db.tenantProvider.findMany({
      where: {
        tenantId,
        Tenant: {
          userId: ctx.context.userId,
        },
      },
    });

    return tenantProviders;
  },
);

export default getAllTenantProviders;
