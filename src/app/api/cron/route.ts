import type { NextRequest } from 'next/server';

import { env } from '@/env';
import { validateBearerToken } from '@/utils/rest';
import db from '@/lib/db';
import { generateJwk } from '@/utils/jwk';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  if (!validateBearerToken(request, env.CRON_SECRET)) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

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

    // get all projects that need to rotate jwks
    const projects = await db.project.findMany({
      where: {
        rotateJwks: true,
      },
    });

    // get all jwks for the projects, and keep the last 1 key and delete the rest and add the new one
    for (const project of projects) {
      await db.$transaction(async (tx) => {
        const jwks = await tx.jwks.findMany({
          where: {
            projectId: project.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
          },
        });

        const excludeQuery: Prisma.JwksWhereInput = {};
        if (jwks.length > 1) {
          excludeQuery.id = jwks[0].id;
        }

        // keep the last 1 key and delete the rest, also createdAt should be greater than a 24 hours ago
        await tx.jwks.deleteMany({
          where: {
            projectId: project.id,
            createdAt: {
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            NOT: excludeQuery,
          },
        });

        // add the new key
        const [kid, jwk] = await generateJwk('RS256');
        await tx.jwks.create({
          data: {
            projectId: project.id,
            kid,
            key: jwk as unknown as Prisma.JsonObject,
          },
        });
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
