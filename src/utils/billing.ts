import { env } from '@/env';

export const PLAN = {
  FREE: 'free',
  PRO: 'pro',
  ULTIMATE: 'ultimate',
} as const;

export const PLAN_NAMES = {
  [PLAN.FREE]: 'Free',
  [PLAN.PRO]: 'Pro',
  [PLAN.ULTIMATE]: 'Ultimate',
};

export const POPULAR_PLAN = PLAN.PRO;
export type PlanName = (typeof PLAN)[keyof typeof PLAN];

export type PlanDetails = {
  id: PlanName;
  providers: {
    available: boolean;
    limit: number;
    clients: number; // clients per provider
  };
  tenants: {
    available: boolean;
    limit: number;
    providers: number; // providers per tenant
  };
  customDomain: {
    available: boolean;
    limit: number;
  };
  rotateSigningKey: boolean;
};

export const PLAN_LIMITS: Record<PlanName, PlanDetails> = {
  [PLAN.FREE]: {
    id: PLAN.FREE,
    providers: {
      available: true,
      limit: 1,
      clients: 999,
    },
    tenants: {
      available: false,
      limit: 0,
      providers: 0,
    },
    customDomain: {
      available: false,
      limit: 0,
    },
    rotateSigningKey: false,
  },
  [PLAN.PRO]: {
    id: PLAN.PRO,
    providers: {
      available: true,
      limit: 10,
      clients: 9999,
    },
    tenants: {
      available: true,
      limit: 10,
      providers: 9999,
    },
    customDomain: {
      available: true,
      limit: 1,
    },
    rotateSigningKey: true,
  },
  [PLAN.ULTIMATE]: {
    id: PLAN.ULTIMATE,
    providers: {
      available: true,
      limit: 100,
      clients: 9999,
    },
    tenants: {
      available: true,
      limit: 100,
      providers: 9999,
    },
    customDomain: {
      available: true,
      limit: 1,
    },
    rotateSigningKey: true,
  },
};

export type PlanData = {
  id: PlanName;
  name: string;
  price: number;
  features: string[];
  productId: string | null;
};

export const Plans: PlanData[] = [
  {
    id: PLAN.FREE,
    name: PLAN_NAMES[PLAN.FREE],
    price: 0,
    features: [`${PLAN_LIMITS[PLAN.FREE].providers} Providers`, 'Free forever', 'API access to create clients'],
    productId: null,
  },
  {
    id: PLAN.PRO,
    name: PLAN_NAMES[PLAN.PRO],
    price: 9,
    features: [
      `${PLAN_LIMITS[PLAN.PRO].providers} Providers`,
      'Custom domains',
      'Priority support',
      'Request custom signing keys',
    ],
    productId: env.NEXT_PUBLIC_CREEM_PRO_PLAN_PRODUCT_ID,
  },
  {
    id: PLAN.ULTIMATE,
    name: PLAN_NAMES[PLAN.ULTIMATE],
    price: 49,
    features: [
      `${PLAN_LIMITS[PLAN.ULTIMATE].providers} Providers`,
      'All in starter',
      'API access to create providers',
      'Auto Rotate signing keys',
      'Priority support 24/5',
    ],
    productId: env.NEXT_PUBLIC_CREEM_ULTIMATE_PLAN_PRODUCT_ID,
  },
];

export const findPlanByProductId = (productId: string): PlanDetails => {
  const plan = Plans.find((plan) => plan.productId === productId);
  if (!plan) {
    return findPlanByPlanName(PLAN.FREE);
  }
  return findPlanByPlanName(plan.id);
};

export const findPlanByPlanName = (planName: PlanName): PlanDetails => {
  return PLAN_LIMITS[planName];
};
