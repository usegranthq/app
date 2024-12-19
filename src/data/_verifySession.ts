import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import ROUTES from '@/constants/routes';

type AuthSession = typeof auth.$Infer.Session;

export const verifySession = cache(async (): Promise<AuthSession> => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!session) {
    return redirect(ROUTES.LOGIN);
  }

  return session;
});
