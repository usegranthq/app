import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { domainFields } from './utils/return-fields';

const getDomain = authRpcRouter.providers.domains.get.handler(async ({ context, input, errors }) => {
  const { providerId, domainId } = input;

  // Check if provider exists
  const provider = await db.provider.findUnique({
    where: {
      id: providerId,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  // check if domain exists
  const domain = await db.domain.findUnique({
    where: {
      id: domainId,
      providerId,
      Provider: {
        userId: context.userId,
      },
    },
    select: domainFields,
  });

  if (!domain) {
    throw errors.DOMAIN_NOT_FOUND();
  }

  return domain;
});

export default getDomain;
