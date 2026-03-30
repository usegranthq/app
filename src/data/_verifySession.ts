import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import ROUTES from '@/constants/routes';
import { auth } from '@/lib/auth';

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
