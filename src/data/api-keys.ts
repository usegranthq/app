import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { ApiKey } from '@/types/app.types';

import { verifySession } from './_verifySession';

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const session = await verifySession();

  const result = await auth.api.listApiKeys({
    query: {
      userId: session.user.id,
    },
    headers: await headers(),
  });

  return result.map((key) => ({
    ...key,
    permissions: null,
    metadata: null,
  }));
};
