import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

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
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!tenant) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_NOT_FOUND);
    }

    return tenant;
  },
);

export default getTenant;
