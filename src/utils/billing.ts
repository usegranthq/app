import { env } from '@/env';

export const PLAN = {
  FREE: 'free',
  PRO: 'pro',
  Ultimate: 'ultimate',
};

export const PLAN_NAMES = {
  [PLAN.FREE]: 'Free',
  [PLAN.PRO]: 'Pro',
  [PLAN.Ultimate]: 'Ultimate',
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
  [PLAN.Ultimate]: {
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
    id: PLAN.Ultimate,
    name: PLAN_NAMES[PLAN.Ultimate],
    price: 49,
    features: [
      `${PLAN_LIMITS[PLAN.Ultimate].projects} Projects`,
      'All in starter',
      'API access to create projects',
      'Auto Rotate signing keys',
      'Priority support 24/5',
    ],
    priceId: env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
  },
];
