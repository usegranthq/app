import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { tenantSchema } from '@/schema';

const createTenant = createAuthEndpoint(
  'v1/tenants',
  {
    method: 'POST',
    body: tenantSchema,
  },
  async (ctx) => {
    const { name, description } = ctx.body;

    // check if tenant already exists
    const tenantExists = await db.tenant
      .count({
        where: {
          userId: ctx.context.userId,
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      })
      .then(Boolean);

    if (tenantExists) {
      throw new SdkError('CONFLICT', ERRORS.TENANT_ALREADY_EXISTS);
    }

    const tenant = await db.tenant.create({
      data: {
        name,
        description,
        userId: ctx.context.userId,
      },
    });

    return tenant;
  },
);

export default createTenant;
