import 'server-only';
import { JWK } from 'jose';

import { Prisma } from '@/types/db.types';
import { generateJwk } from '@/utils/jwk';

import db from './db';

// providers without a signing key get one generated on first use
export const createSigningKey = async (providerId: string): Promise<JWK> => {
  const [kid, jwk] = await generateJwk('RS256');

  await db.jwks.create({
    data: {
      kid,
      key: jwk as unknown as Prisma.JsonObject,
      providerId,
    },
  });

  return jwk;
};
