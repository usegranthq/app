import 'server-only';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { Session, User } from '@/types/app.types';

import { verifySession } from './_verifySession';

export const getUser = async (): Promise<User> => {
  const session = await verifySession();
  return session.user;
};

export const getSessions = async (): Promise<Session[]> => {
  const session = await verifySession();

  const sessions = await db.session.findMany({
    where: {
      userId: session.user.id,
      NOT: {
        id: session.session.id,
      },
    },
  });

  return sessions;
};

const socialProviders = ['github', 'google'];
export const getSocialAccounts = async () => {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return accounts
    .filter((account) => socialProviders.includes(account.providerId))
    .map((account) => ({ id: account.id, providerId: account.providerId }));
};
