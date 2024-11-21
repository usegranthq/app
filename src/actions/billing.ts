'use server';

import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';
import { verifySession } from '@/data/_verifySession';
import paddle from '@/lib/paddle';
import { getSubscriptionByTransactionId } from '@/lib/paddle/subscription';

export const updateAfterCheckout = async (customerId: string, transactionId: string): ActionResponse => {
  const session = await verifySession();

  try {
    const subscription = await getSubscriptionByTransactionId(transactionId);

    const customer = await db.customer.upsert({
      where: { userId: session.user.id },
      update: {},
      create: {
        userId: session.user.id,
        paddleCustomerId: customerId,
      },
    });

    const data = {
      subscriptionStatus: subscription.status,
      priceId: subscription.items[0].price?.id ?? '',
      productId: subscription.items[0].price?.productId ?? '',
      scheduledChange: subscription.scheduledChange?.effectiveAt ?? null,
      customerId: customer.id,
    };

    await db.subscription.upsert({
      where: {
        subscriptionId: subscription.id,
      },
      update: data,
      create: {
        subscriptionId: subscription.id,
        ...data,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to update subscription');
    return [errorMessage, null];
  }

  revalidatePath('/settings/billing');
  return [null, null];
};

export const cancelSubscription = async (): ActionResponse => {
  const session = await verifySession();

  const customerId = await db.customer.findFirst({
    where: { userId: session.user.id },
  });

  if (!customerId) {
    return ['Invalid customer. Try again or contact support.', null];
  }

  const subscription = await db.subscription.findFirst({
    where: {
      customerId: customerId.id,
      subscriptionStatus: 'active',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!subscription) {
    return ['No active subscription found', null];
  }

  try {
    const newSubscription = await paddle.cancelSubscription(subscription.subscriptionId);

    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        subscriptionStatus: newSubscription.status,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to cancel subscription');
    return [errorMessage, null];
  }

  revalidatePath('/settings/billing');
  return [null, null];
};
