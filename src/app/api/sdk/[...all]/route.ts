import { createRouter } from 'better-call';

import { getBearerToken, rateLimitedResponse, unauthorizedResponse } from '@/utils/rest';
import { auth } from '@/lib/auth';

import endpoints from './endpoints';

type VerifyApiRateLimitedError = {
  code: 'RATE_LIMITED';
  tryAgainIn: number | null;
};

type VerifyApiKeyNotFoundError = {
  code: 'KEY_NOT_FOUND';
};

type VerifyApiKeyResult = [VerifyApiRateLimitedError | VerifyApiKeyNotFoundError, null] | [null, string];

const verifyApiKey = async (key: string): Promise<VerifyApiKeyResult> => {
  const result = await auth.api.verifyApiKey({
    body: {
      key,
    },
  });

  if (result.error?.code === 'RATE_LIMITED') {
    const error: VerifyApiRateLimitedError = {
      code: 'RATE_LIMITED',
      tryAgainIn: result.error.details.tryAgainIn,
    };
    return [error, null];
  }

  if (!result.valid || !result.key) {
    const error: VerifyApiKeyNotFoundError = {
      code: 'KEY_NOT_FOUND',
    };
    return [error, null];
  }

  return [null, result.key.userId];
};

export const handler = async (request: Request) => {
  const bearerToken = getBearerToken(request);
  if (!bearerToken) {
    return unauthorizedResponse('Missing api key');
  }

  const [error, userId] = await verifyApiKey(bearerToken);
  if (error) {
    switch (error.code) {
      case 'RATE_LIMITED':
        return rateLimitedResponse('Api key rate limit reached', error.tryAgainIn);
      default:
        break;
    }

    return unauthorizedResponse('Unauthorized');
  }

  const router = createRouter(endpoints, {
    basePath: '/sdk',
    routerContext: {
      userId,
    },
    openAPI: {
      disabled: true,
    },
  });

  return router.handler(request);
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
