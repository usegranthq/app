import type { NextRequest } from 'next/server';

import env from '@/env';
import db from '@/lib/db';
import logger from '@/lib/log';
import { Prisma } from '@/types/db.types';
import { generateJwk } from '@/utils/jwk';
import { MAX_EXPIRY } from '@/utils/jwt';
import { validateBearerToken } from '@/utils/rest';

// rotate signing keys at most once a day, however often the cron runs,
// with an hour of slack so a daily cron that fires slightly early still rotates
const ROTATION_INTERVAL_MS = 23 * 60 * 60 * 1000;

const processCron = async () => {
  const now = new Date();

  try {
    // cleanup users expired sessions and return count
    await db.session.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    // cleanup users expired verifications
    await db.verification.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    // get all providers that need to rotate jwks
    const providers = await db.provider.findMany({
      where: {
        rotateJwks: true,
      },
    });

    for (const provider of providers) {
      await db.$transaction(async (tx) => {
        const keys = await tx.jwks.findMany({
          where: {
            providerId: provider.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            createdAt: true,
          },
        });

        const [currentKey] = keys;
        if (currentKey && now.getTime() - currentKey.createdAt.getTime() < ROTATION_INTERVAL_MS) {
          return;
        }

        // a key signs tokens until the next key is created, and those tokens stay valid for up to MAX_EXPIRY,
        // so delete a key only once it was replaced more than MAX_EXPIRY ago
        const retiredBefore = now.getTime() - MAX_EXPIRY * 1000;
        const expiredKeyIds = keys
          .filter((_, index) => index > 0 && keys[index - 1].createdAt.getTime() < retiredBefore)
          .map((key) => key.id);

        await tx.jwks.deleteMany({
          where: {
            id: {
              in: expiredKeyIds,
            },
          },
        });

        // add the new key
        const [kid, jwk] = await generateJwk('RS256');
        await tx.jwks.create({
          data: {
            providerId: provider.id,
            kid,
            key: jwk as unknown as Prisma.JsonObject,
          },
        });
      });
    }
  } catch (error) {
    logger.error('Error processing cron', error);
  }
};

export async function GET(request: NextRequest) {
  if (!validateBearerToken(request, env.CRON_SECRET)) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  processCron();
  return Response.json({ success: true });
}
