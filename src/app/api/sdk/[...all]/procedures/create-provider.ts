import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';
import { createUrlId } from '@/utils/provider';

import { authRpcRouter } from '../rpc';
import { providerFields } from './utils/return-fields';

const createProvider = authRpcRouter.providers.create.handler(async ({ context, input, errors }) => {
  const { name, description } = input;

  const plan = await getPlanByUserId(context.userId);
  if (!plan.features.providers.available) {
    throw errors.PROVIDERS_NOT_AVAILABLE();
  }

  const providersCount = await db.provider.count({
    where: {
      userId: context.userId,
    },
  });

  if (providersCount >= plan.features.providers.limit) {
    throw errors.MAX_PROVIDERS_LIMIT_REACHED();
  }

  try {
    const provider = await db.provider.create({
      data: {
        name,
        description,
        urlId: createUrlId(name),
        userId: context.userId,
      },
      select: providerFields,
    });

    return {
      id: provider.id,
      name: provider.name,
      description: provider.description,
      rotateJwks: provider.rotateJwks,
      urlId: provider.urlId,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');

    throw errors.INTERNAL_SERVER_ERROR({
      message: errorMessage,
    });
  }
});

export default createProvider;
