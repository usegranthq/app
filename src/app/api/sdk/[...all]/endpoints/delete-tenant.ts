import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';

const deleteTenant = createAuthEndpoint(
  'v1/tenants/:id',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { id } = ctx.params;

    const tenant = await db.tenant.findUnique({
      where: {
        id,
        userId: ctx.context.userId,
      },
    });

    if (!tenant) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_NOT_FOUND);
    }

    try {
      await db.tenant.delete({
        where: {
          id,
          userId: ctx.context.userId,
        },
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }

    return toSdkJsonResponse(null, STATUS_CODES.NO_CONTENT);
  },
);

export default deleteTenant;
