import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { tenantFields } from './utils/return-fields';

const getTenant = createAuthEndpoint(
  'v1/tenants/:id',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { id } = ctx.params;

    const tenant = await db.tenant.findUnique({
      where: {
        id,
        userId: ctx.context.userId,
      },
      select: tenantFields,
    });

    if (!tenant) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_NOT_FOUND);
    }

    return tenant;
  },
);

export default getTenant;
