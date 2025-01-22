'use server';

import { redirect } from 'next/navigation';

import { getApiErrorMessage } from '@/utils/error';
import { verifySession } from '@/data/_verifySession';
import * as creem from '@/lib/creem';
import db from '@/lib/db';

export const checkout = async (productId: string): ActionResponse => {
  const session = await verifySession();
  let sessionURL = '';

  try {
    const checkoutSession = await creem.createCheckoutSession(session.user.email, productId);
    sessionURL = checkoutSession.checkout_url;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create a checkout session');
    return [errorMessage, null];
  }

  // redirect to checkout session
  redirect(sessionURL);
};

export const cancelSubscription = async (): ActionResponse => {
  const session = await verifySession();

  // find customer
  const customer = await db.customer.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!customer) {
    return ['Customer not found', null];
  }

  // get subscription
  const subscription = await db.subscription.findFirst({
    where: {
      status: 'active',
      customerId: customer.id,
    },
  });

  if (!subscription) {
    return ['Subscription not found', null];
  }

  // cancel subscription
  try {
    const creemSubscription = await creem.cancelSubscription(subscription.subscriptionRefId);

    // update subscription
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: creemSubscription.status },
    });
  } catch {
    return ['Failed to cancel subscription', null];
  }

  return [null, null];
};
