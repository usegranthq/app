import { getPlanByUserId } from '@/lib/auth';
import db from '@/lib/db';
import { tenantSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const createTenant = createAuthEndpoint(
  'v1/tenants',
  {
    method: 'POST',
    body: tenantSchema,
  },
  async (ctx) => {
    const { name, description } = ctx.body;

    const plan = await getPlanByUserId(ctx.context.userId);
    const tenantsCount = await db.tenant.count({
      where: {
        userId: ctx.context.userId,
      },
    });

    if (!plan.tenants.available) {
      throw new SdkError('FORBIDDEN', ERRORS.TENANTS_NOT_AVAILABLE);
    }

    if (tenantsCount >= plan.tenants.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_TENANTS_LIMIT_REACHED);
    }

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
