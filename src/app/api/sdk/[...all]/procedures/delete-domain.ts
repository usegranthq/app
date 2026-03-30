import db from '@/lib/db';
import customDomain from '@/lib/domain';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';

const deleteDomain = authRpcRouter.providers.domains.delete.handler(async ({ context, input, errors }) => {
  // Check if provider exists
  const provider = await db.provider.findUnique({
    where: {
      id: input.providerId,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  // check if domain exists
  const domain = await db.domain.findUnique({
    where: {
      id: input.domainId,
      providerId: input.providerId,
      Provider: {
        userId: context.userId,
      },
    },
  });

  if (!domain) {
    throw errors.DOMAIN_NOT_FOUND();
  }

  try {
    await customDomain.remove(domain.externalId);
    await db.domain.delete({
      where: {
        domain: domain.domain,
        providerId: input.providerId,
        Provider: {
          userId: context.userId,
        },
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({ message: errorMessage });
  }
});

export default deleteDomain;
