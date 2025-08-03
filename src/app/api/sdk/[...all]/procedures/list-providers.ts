import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { providerFields } from './utils/return-fields';

const listProviders = authRpcRouter.providers.list.handler(async ({ context }) => {
  const providers = await db.provider.findMany({
    where: {
      userId: context.userId,
    },
    select: providerFields,
  });

  return providers;
});

export default listProviders;
