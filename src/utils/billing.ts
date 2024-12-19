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

export const PLAN_LIMITS = {
  [PLAN.FREE]: {
    projects: 1,
    clientsPerProject: 999,
    customDomain: false,
    rotateSigningKey: false,
  },
  [PLAN.PRO]: {
    projects: 10,
    clientsPerProject: 999,
    customDomain: true,
    rotateSigningKey: true,
  },
  [PLAN.ULTIMATE]: {
    projects: 100,
    clientsPerProject: 999,
    customDomain: true,
    rotateSigningKey: true,
  },
};

export type Plan = (typeof PLAN)[keyof typeof PLAN];

export type PlanData = {
  id: Plan;
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
    priceId: env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID,
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
    priceId: env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
  },
];

export const findPlanByPriceId = (priceId: string): Plan => {
  return Plans.find((plan) => plan.priceId === priceId)?.id ?? PLAN.FREE;
};
