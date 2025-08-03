import { implement, ORPCError } from '@orpc/server';

import { getBearerToken } from '@/utils/rest';

import verifyApiKey from './middlewares/token';
import contract from './procedures/utils/contract';

interface OrpcContext {
  headers: Headers;
}

const rpcRouter = implement(contract).$context<OrpcContext>();

export const authRpcRouter = rpcRouter.use(async ({ context, next }) => {
  const bearerToken = getBearerToken(context.headers);
  if (!bearerToken) {
    throw new ORPCError('UNAUTHORIZED', { message: 'API key required' });
  }

  const [error, userId] = await verifyApiKey(bearerToken);
  if (error) {
    switch (error.code) {
      case 'RATE_LIMITED':
        throw new ORPCError('TOO_MANY_REQUESTS');
      default:
        break;
    }

    throw new ORPCError('UNAUTHORIZED');
  }

  // check token
  return next({
    context: {
      userId,
    },
  });
});

export default rpcRouter;
