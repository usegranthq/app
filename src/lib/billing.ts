import { findPlanByPlanName, findPlanByProductId, PLAN, PlanDetails } from '@/utils/billing';

import db from './db';

export const getPlanByUserId = async (userId: string): Promise<PlanDetails> => {
  const customer = await db.customer.findUnique({
    where: {
      userId,
    },
  });

  if (!customer) {
    return findPlanByPlanName(PLAN.FREE);
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
    return findPlanByPlanName(PLAN.FREE);
  }

  return findPlanByProductId(subscription.productId);
};
