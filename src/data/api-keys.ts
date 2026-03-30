import 'server-only';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { ApiKey } from '@/types/app.types';

import { verifySession } from './_verifySession';

export const getApiKeys = async (): Promise<ApiKey[]> => {
  await verifySession();

  const { apiKeys } = await auth.api.listApiKeys({
    headers: await headers(),
  });

  return apiKeys.map((key) => ({
    ...key,
    permissions: null,
    metadata: null,
  }));
};
