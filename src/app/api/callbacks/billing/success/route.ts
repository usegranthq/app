import { NextRequest, NextResponse } from 'next/server';

import { generateRequestSignature, getSubscription, redirectParamsSchema } from '@/lib/creem';
import db from '@/lib/db';
import ROUTES from '@/constants/routes';
import { env } from '@/env';

export const GET = async (request: NextRequest) => {
  // get invite code from request query params
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());

  // validate entries
  const parseResult = redirectParamsSchema.safeParse(params);
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
  }

  // validate signature
  const signature = generateRequestSignature(parseResult.data, env.CREEM_API_KEY);
  if (signature !== parseResult.data.signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // create customer
  const subscription = await getSubscription(parseResult.data.subscription_id);

  // get user by email
  const user = await db.user.findUnique({
    where: {
      email: subscription.customer.email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    // create customer
    await db.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: {
          userId: user.id,
        },
        update: {
          customerRefId: subscription.customer.id,
        },
        create: {
          userId: user.id,
          customerRefId: subscription.customer.id,
        },
      });

      // create subscription
      await tx.subscription.upsert({
        where: {
          subscriptionRefId: subscription.id,
        },
        update: {
          status: subscription.status,
        },
        create: {
          customerId: customer.id,
          subscriptionRefId: subscription.id,
          status: subscription.status,
          productId: subscription.product.id,
        },
      });
    });

    return NextResponse.redirect(new URL(ROUTES.SETTINGS_BILLING, request.url));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
};
