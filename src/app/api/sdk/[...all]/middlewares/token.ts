import { auth } from '@/lib/auth';

type VerifyApiRateLimitedError = {
  code: 'RATE_LIMITED';
  tryAgainIn: string | null;
};

type VerifyApiKeyNotFoundError = {
  code: 'KEY_NOT_FOUND';
};

type VerifyApiKeyResult = [VerifyApiRateLimitedError | VerifyApiKeyNotFoundError, null] | [null, string];

export default async function verifyApiKey(key: string): Promise<VerifyApiKeyResult> {
  const result = await auth.api.verifyApiKey({
    body: {
      key,
      permissions: {
        sdk: ['read', 'write'],
      },
    },
  });

  if (result.error?.code === 'RATE_LIMITED') {
    const error: VerifyApiRateLimitedError = {
      code: 'RATE_LIMITED',
      tryAgainIn: null,
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
}
