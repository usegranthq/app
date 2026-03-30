import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';

const deleteTenant = authRpcRouter.tenants.delete.handler(async ({ context, input, errors }) => {
  const { id } = input;

  const tenant = await db.tenant.findUnique({
    where: {
      id,
      userId: context.userId,
    },
  });

  if (!tenant) {
    throw errors.TENANT_NOT_FOUND();
  }

  try {
    await db.tenant.delete({
      where: {
        id,
        userId: context.userId,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({
      message: errorMessage,
    });
  }
});

export default deleteTenant;
