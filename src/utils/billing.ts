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
  signingKeys: {
    request: boolean;
    autoRotate: boolean;
  };
  apiAccess: boolean;
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
      limit: 1,
      providers: 999,
    },
    customDomain: {
      available: false,
      limit: 0,
    },
    signingKeys: {
      request: false,
      autoRotate: false,
    },
    apiAccess: false,
  },
  [PLAN.PRO]: {
    id: PLAN.PRO,
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
    signingKeys: {
      request: true,
      autoRotate: false,
    },
    apiAccess: true,
  },
  [PLAN.ULTIMATE]: {
    id: PLAN.ULTIMATE,
    providers: {
      available: true,
      limit: 1000,
      clients: 99999,
    },
    tenants: {
      available: true,
      limit: 1000,
      providers: 99999,
    },
    customDomain: {
      available: true,
      limit: 1,
    },
    signingKeys: {
      request: true,
      autoRotate: true,
    },
    apiAccess: true,
  },
};

export type PlanData = {
  id: PlanName;
  name: string;
  price: number;
  features: string[];
  productId: string | null;
};

const isSingular = (value: number) => value === 1;

export const Plans: PlanData[] = [
  {
    id: PLAN.FREE,
    name: PLAN_NAMES[PLAN.FREE],
    price: 0,
    features: [
      `${PLAN_LIMITS[PLAN.FREE].providers.limit} ${isSingular(PLAN_LIMITS[PLAN.FREE].providers.limit) ? 'Provider' : 'Providers'}`,
      `${PLAN_LIMITS[PLAN.FREE].tenants.limit} ${isSingular(PLAN_LIMITS[PLAN.FREE].tenants.limit) ? 'Tenant' : 'Tenants'}`,
      `${PLAN_LIMITS[PLAN.FREE].providers.clients} clients per provider`,
      `${PLAN_LIMITS[PLAN.FREE].tenants.providers} providers per tenant`,
      'Free forever',
    ],
    productId: null,
  },
  {
    id: PLAN.PRO,
    name: PLAN_NAMES[PLAN.PRO],
    price: 9,
    features: [
      `${PLAN_LIMITS[PLAN.PRO].providers.limit} Providers`,
      `${PLAN_LIMITS[PLAN.PRO].tenants.limit} Tenants`,
      'Unlimited clients per provider',
      'Unlimited providers per tenant',
      'Custom domain',
      'API access',
      'Request custom signing keys',
      'Priority support',
    ],
    productId: env.NEXT_PUBLIC_CREEM_PRO_PLAN_PRODUCT_ID,
  },
  {
    id: PLAN.ULTIMATE,
    name: PLAN_NAMES[PLAN.ULTIMATE],
    price: 49,
    features: [
      `${PLAN_LIMITS[PLAN.ULTIMATE].providers.limit} Providers`,
      `${PLAN_LIMITS[PLAN.ULTIMATE].tenants.limit} Tenants`,
      'All in starter',
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
