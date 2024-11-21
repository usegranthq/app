import { env } from '@/env';

export const PLAN = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
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
    name: 'Free',
    price: 0,
    features: ['1 Project', 'Free forever', 'API access to create clients'],
    priceId: null,
  },
  {
    id: PLAN.STARTER,
    name: 'Starter',
    price: 9,
    features: ['10 Projects', 'Custom domains', 'Priority support', 'Request custom signing keys'],
    priceId: env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID,
  },
  {
    id: PLAN.PRO,
    name: 'Pro',
    price: 49,
    features: [
      '100 Projects',
      'All in starter',
      'API access to create projects',
      'Auto Rotate signing keys',
      'Priority support 24/5',
    ],
    priceId: env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
  },
];
