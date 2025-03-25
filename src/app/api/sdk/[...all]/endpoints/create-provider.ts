import { getApiErrorMessage } from '@/utils/error';
import { createUrlId } from '@/utils/provider';
import { STATUS_CODES } from '@/utils/rest';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { providerSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';
import { providerFields } from './utils/return-fields';

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

    if (!plan.features.providers.available) {
      throw new SdkError('FORBIDDEN', ERRORS.PROVIDERS_NOT_AVAILABLE);
    }

    if (providersCount >= plan.features.providers.limit) {
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
        select: providerFields,
      });

      return toSdkJsonResponse(provider, STATUS_CODES.CREATED);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createProvider;
