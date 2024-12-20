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
  projects: number;
  clients: number;
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
    projects: 1,
    clients: 999,
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
    projects: 10,
    clients: 9999,
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
    projects: 100,
    clients: 9999,
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
  priceId: string | null;
};

export const Plans: PlanData[] = [
  {
    id: PLAN.FREE,
    name: PLAN_NAMES[PLAN.FREE],
    price: 0,
    features: [`${PLAN_LIMITS[PLAN.FREE].projects} Project`, 'Free forever', 'API access to create clients'],
    priceId: null,
  },
  {
    id: PLAN.PRO,
    name: PLAN_NAMES[PLAN.PRO],
    price: 9,
    features: [
      `${PLAN_LIMITS[PLAN.PRO].projects} Projects`,
      'Custom domains',
      'Priority support',
      'Request custom signing keys',
    ],
    priceId: env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
  },
  {
    id: PLAN.ULTIMATE,
    name: PLAN_NAMES[PLAN.ULTIMATE],
    price: 49,
    features: [
      `${PLAN_LIMITS[PLAN.ULTIMATE].projects} Projects`,
      'All in starter',
      'API access to create projects',
      'Auto Rotate signing keys',
      'Priority support 24/5',
    ],
    priceId: env.NEXT_PUBLIC_PADDLE_ULTIMATE_PRICE_ID,
  },
];

export const findPlanByPriceId = (priceId: string): PlanDetails => {
  const planName = Plans.find((plan) => plan.priceId === priceId)?.id ?? PLAN.FREE;
  return findPlanByPlanName(planName);
};

export const findPlanByPlanName = (planName: PlanName): PlanDetails => {
  return PLAN_LIMITS[planName];
};
