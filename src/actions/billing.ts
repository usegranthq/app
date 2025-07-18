'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import ROUTES from '@/constants/routes';
import { PlanId, PLANS } from '@/utils/billing';
import { generateHMACState } from '@/utils/callbacks';
import { getApiErrorMessage } from '@/utils/error';
import { getPlanProductId } from '@/lib/billing';
import db from '@/lib/db';
import polarClient from '@/lib/polar';
import { verifySession } from '@/data/_verifySession';
import { getCustomer, getSubscription } from '@/data/user';
import env from '@/env';

export const checkout = async (planId: PlanId): ActionResponse => {
  const session = await verifySession();

  if (planId === 'free') {
    return ["You can't upgrade to free plan. You can cancel the subscription instead", null];
  }

  const plan = PLANS[planId];
  const planProductId = getPlanProductId(planId);

  if (!plan || !planProductId) {
    return ['Invalid product', null];
  }

  const customer = await getCustomer();

  const state = generateHMACState(env.STATE_HMAC_SECRET_KEY);

  const successUrl = new URL(
    `${ROUTES.API_BILLING_SUCCESS_URL}?checkout_id={CHECKOUT_ID}&state=${state}`,
    env.SITE_URL,
  );

  let sessionURL = '';

  try {
    const checkoutSession = await polarClient.checkouts.create({
      externalCustomerId: session.user.id,
      products: [planProductId],
      customerId: customer?.customerRefId,
      customerEmail: session.user.email,
      successUrl: successUrl.toString(),
    });
    sessionURL = checkoutSession.url;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create a checkout session');
    return [errorMessage, null];
  }

  // redirect to checkout session
  redirect(sessionURL);
};

export const upgradePlan = async (planId: PlanId): ActionResponse => {
  const session = await verifySession();

  if (planId === 'free') {
    return ["You can't upgrade to free plan. You can cancel the subscription instead", null];
  }

  const plan = PLANS[planId];
  const planProductId = getPlanProductId(planId);

  if (!plan || !planProductId) {
    return ['Invalid product', null];
  }

  const activeSubscription = await getSubscription();
  if (!activeSubscription) {
    return ['No active subscription found', null];
  }

  if (activeSubscription.productId === planProductId) {
    return ['You are already on the same plan', null];
  }

  try {
    const subscription = await polarClient.subscriptions.update({
      id: activeSubscription.subscriptionRefId,
      subscriptionUpdate: {
        productId: planProductId,
        prorationBehavior: 'prorate',
      },
    });

    // update subscription
    await db.subscription.update({
      where: { id: activeSubscription.id, Customer: { userId: session.user.id } },
      data: { status: subscription.status, productId: subscription.productId },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = getApiErrorMessage(error, 'Failed to create a checkout session');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.SETTINGS_BILLING);
  return [null, null];
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
      Customer: {
        userId: session.user.id,
      },
    },
  });

  if (!subscription) {
    return ['Subscription not found', null];
  }

  // cancel subscription
  try {
    const polarSubscription = await polarClient.subscriptions.revoke({
      id: subscription.subscriptionRefId,
    });

    // update subscription
    await db.subscription.update({
      where: { id: subscription.id, Customer: { userId: session.user.id } },
      data: { status: polarSubscription.status },
    });
  } catch (err) {
    console.log(err);
    return ['Failed to cancel subscription', null];
  }

  return [null, null];
};

export const redirectToCustomerPortal = async (): ActionResponse<string | null> => {
  await verifySession();
  const customer = await getCustomer();

  if (!customer) {
    return ['Customer not found', null];
  }

  try {
    const url = await polarClient.customerSessions.create({
      customerId: customer.customerRefId,
    });
    return [null, url.customerPortalUrl];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to redirect to customer portal');
    return [errorMessage, null];
  }
};
