import 'server-only';

import db from '@/lib/db';
import { Token } from '@/types/app.types';

import { verifySession } from './_verifySession';

export const getTokens = async (): Promise<Token[]> => {
  const session = await verifySession();

  return await db.token.findMany({
    where: {
      accountId: session.account.id,
    },
  });
};
