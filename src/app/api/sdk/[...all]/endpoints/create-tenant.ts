import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { tenantSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';
import { tenantFields } from './utils/return-fields';

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

    if (!plan.features.tenants.available) {
      throw new SdkError('FORBIDDEN', ERRORS.TENANTS_NOT_AVAILABLE);
    }

    if (tenantsCount >= plan.features.tenants.limit) {
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

    try {
      const tenant = await db.tenant.create({
        data: {
          name,
          description,
          userId: ctx.context.userId,
        },
        select: tenantFields,
      });

      return toSdkJsonResponse(tenant, STATUS_CODES.CREATED);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createTenant;
