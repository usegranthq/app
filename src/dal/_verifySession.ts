import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { Account } from '@/types/app.types';
import ROUTES from '@/constants/routes';
import db from '@/lib/db';

type AuthSession = typeof auth.$Infer.Session;
type SessionResult = AuthSession & {
  account: Account;
};

export const verifySession = cache(async (): Promise<SessionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect(ROUTES.LOGIN);
  }

  const account = await db.account.findFirst({
    where: { userId: session.user.id },
  });

  if (!account) {
    return redirect(ROUTES.LOGIN);
  }

  return {
    ...session,
    account,
  };
});
