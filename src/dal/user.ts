import 'server-only';

import { Session, User } from '@/types/app.types';
import db from '@/lib/db';

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
