import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';

const deleteTenantProvider = createAuthEndpoint(
  'v1/tenants/:tenantId/providers/:providerId',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { tenantId, providerId } = ctx.params;

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

    const tenantProvider = await db.tenantProvider.findUnique({
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

    try {
      await db.tenantProvider.delete({
        where: {
          id: providerId,
          tenantId,
          Tenant: {
            userId: ctx.context.userId,
          },
        },
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }

    return toSdkJsonResponse({}, STATUS_CODES.NO_CONTENT);
  },
);

export default deleteTenantProvider;
