import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { domainFields } from './utils/return-fields';

const listDomains = authRpcRouter.providers.domains.list.handler(async ({ context, input, errors }) => {
  const { providerId } = input;

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

  const domains = await db.domain.findMany({
    where: {
      providerId,
      Provider: {
        userId: context.userId,
      },
    },
    select: domainFields,
  });

  return domains;
});

export default listDomains;
