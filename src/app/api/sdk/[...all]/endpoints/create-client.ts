import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import { clientSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';
import { clientFields } from './utils/return-fields';

const createClient = createAuthEndpoint(
  'v1/providers/:id/clients',
  {
    method: 'POST',
    body: clientSchema,
  },
  async (ctx) => {
    const { name, audience } = ctx.body;

    // Check if provider exists
    const provider = await db.provider.findUnique({
      where: {
        id: ctx.params.id,
        userId: ctx.context.userId,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    const plan = await getPlanByUserId(ctx.context.userId);
    const clientsCount = await db.client.count({
      where: {
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });

    if (clientsCount >= plan.features.providerClients.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_CLIENTS_LIMIT_REACHED);
    }

    // check if client already exists
    const existingClient = await db.client.findFirst({
      where: {
        name,
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });
    if (existingClient) {
      throw new SdkError('BAD_REQUEST', ERRORS.CLIENT_ALREADY_EXISTS);
    }

    try {
      const client = await db.client.create({
        data: {
          name,
          audience,
          providerId: ctx.params.id,
        },
        select: clientFields,
      });

      return toSdkJsonResponse(client, STATUS_CODES.CREATED);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      return new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createClient;
