import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { providerFields } from './utils/return-fields';

const getProvider = authRpcRouter.providers.get.handler(async ({ context, input, errors }) => {
  const { id } = input;

  const provider = await db.provider.findUnique({
    where: {
      id,
      userId: context.userId,
    },
    select: providerFields,
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  return provider;
});

export default getProvider;
