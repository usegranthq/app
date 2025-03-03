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
      customerId: customer.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!subscription || subscription.status !== 'active') {
    return PLANS.free;
  }

  return findPlanByProductId(subscription.productId);
};
