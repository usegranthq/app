import db from '@/lib/db';
import { createAuthEndpoint } from './utils/call';
import { createUrlId } from '@/utils/provider';
import { getApiErrorMessage } from '@/utils/error';
import { getPlanByUserId } from '@/lib/auth';
import { providerSchema } from '@/schema';

import ERRORS, { SdkError } from './utils/errors';

const createProvider = createAuthEndpoint(
  'v1/providers',
  {
    method: 'POST',
    body: providerSchema,
  },
  async (ctx) => {
    const { name, description } = ctx.body;

    const plan = await getPlanByUserId(ctx.context.userId);
    const providersCount = await db.provider.count({
      where: {
        userId: ctx.context.userId,
      },
    });

    if (providersCount >= plan.providers) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_PROVIDERS_LIMIT_REACHED);
    }

    try {
      const provider = await db.provider.create({
        data: {
          name,
          description,
          urlId: createUrlId(name),
          userId: ctx.context.userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          urlId: true,
        },
      });

      return provider;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createProvider;
