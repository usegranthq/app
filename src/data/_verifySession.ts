import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import ROUTES from '@/constants/routes';

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export const verifySession = cache(async (): Promise<AuthSession> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect(ROUTES.API_UNAUTHORIZED);
  }

  return session;
});
