import type { NextRequest } from 'next/server';

import { env } from '@/env';
import { validateBearerToken } from '@/utils/rest';
import db from '@/lib/db';

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

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
