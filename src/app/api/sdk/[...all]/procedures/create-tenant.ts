import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';
import { tenantFields } from './utils/return-fields';

const createTenant = authRpcRouter.tenants.create.handler(async ({ context, input, errors }) => {
  const { name, description } = input;

  // check if tenant already exists
  const tenantExists = await db.tenant
    .count({
      where: {
        userId: context.userId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })
    .then(Boolean);

  if (tenantExists) {
    throw errors.TENANT_ALREADY_EXISTS();
  }

  try {
    const tenant = await db.tenant.create({
      data: {
        name,
        description,
        userId: context.userId,
      },
      select: tenantFields,
    });

    return tenant;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({ message: errorMessage });
  }
});

export default createTenant;
