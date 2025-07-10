import { PLAN, PlanDetails, PlanId, PLANS } from '@/utils/billing';
import env from '@/env';

import db from './db';

type PlanProductIdEntry = {
  id: PlanId;
  productId: string | null;
};

const PLAN_PRODUCT_IDS: { [K in PlanId]: PlanProductIdEntry } = {
  [PLAN.FREE]: { id: PLAN.FREE, productId: null },
  [PLAN.PRO]: { id: PLAN.PRO, productId: env.POLAR_PRO_PLAN_PRODUCT_ID },
  [PLAN.ULTIMATE]: { id: PLAN.ULTIMATE, productId: env.POLAR_ULTIMATE_PLAN_PRODUCT_ID },
};

export const getPlanProductId = (planId: PlanId): string | null => {
  const planEntry = PLAN_PRODUCT_IDS[planId];
  return planEntry ? planEntry.productId : null;
};

export const findPlanByProductId = (productId: string): PlanDetails => {
  const plan = Object.values(PLAN_PRODUCT_IDS).find((p) => p.productId === productId);
  if (!plan) {
    return PLANS[PLAN.FREE];
  }

  return PLANS[plan.id] ?? PLANS[PLAN.FREE];
};

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
