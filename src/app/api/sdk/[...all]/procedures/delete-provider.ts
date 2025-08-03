import { getApiErrorMessage } from '@/utils/error';
import db from '@/lib/db';
import customDomain from '@/lib/domain';

import { authRpcRouter } from '../rpc';

const deleteProvider = authRpcRouter.providers.delete.handler(async ({ context, input, errors }) => {
  const provider = await db.provider.findUnique({
    where: {
      id: input.id,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  try {
    // delete all domains
    const domains = await db.domain.findMany({
      where: {
        providerId: input.id,
        Provider: { userId: context.userId },
      },
    });

    for (const domain of domains) {
      await customDomain.remove(domain.externalId);
      await db.domain.delete({ where: { id: domain.id, Provider: { userId: context.userId } } });
    }

    await db.provider.delete({
      where: {
        id: input.id,
        userId: context.userId,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({ message: errorMessage });
  }
});

export default deleteProvider;
