import { findPlanByProductId, PlanDetails, PLANS } from '@/utils/billing';

import db from './db';

export const getPlanByUserId = async (userId: string): Promise<PlanDetails> => {
  const customer = await db.customer.findUnique({
    where: {
      userId,
    },
  });

  if (!customer) {
    return PLANS.free;
  }

  const subscription = await db.subscription.findFirst({
    where: {
      status: 'active',
      customerId: customer.id,
      Customer: {
        userId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!subscription) {
    return PLANS.free;
  }

  return findPlanByProductId(subscription.productId);
};
