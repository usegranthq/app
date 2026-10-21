import type { NextRequest } from 'next/server';

import env from '@/env';
import db from '@/lib/db';
import logger from '@/lib/log';
import { Prisma } from '@/types/db.types';
import { generateJwk } from '@/utils/jwk';
import { validateBearerToken } from '@/utils/rest';

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

    // get all jwks for the providers, and keep the last 1 key and delete the rest and add the new one
    for (const provider of providers) {
      await db.$transaction(async (tx) => {
        // keep the last 1 key and delete the rest, also createdAt should be greater than a 24 hours ago
        await tx.jwks.deleteMany({
          where: {
            providerId: provider.id,
            createdAt: {
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
