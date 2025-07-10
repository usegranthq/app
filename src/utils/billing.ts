export const PLAN = {
  FREE: 'free',
  PRO: 'pro',
  ULTIMATE: 'ultimate',
} as const;

export type PlanId = (typeof PLAN)[keyof typeof PLAN];

export type PlanDetails = {
  id: PlanId;
  name: string;
  price: number;
  features: {
    providers: {
      available: boolean;
      limit: number;
    };
    providerClients: {
      available: boolean;
      limit: number;
    };
    tenants: {
      available: boolean;
      limit: number;
    };
    tenantProviders: {
      available: boolean;
      limit: number;
    };
    tenantProviderPolicies: {
      available: boolean;
      limit: number;
    };
    customDomain: {
      available: boolean;
      limit: number;
    };
    signingKeys: {
      request: boolean;
      autoRotate: boolean;
    };
  };
};

export const PLANS: Record<PlanId, PlanDetails> = {
  [PLAN.FREE]: {
    id: PLAN.FREE,
    name: 'Free',
    price: 0,
    features: {
      providers: {
        available: true,
        limit: 1,
      },
      providerClients: {
        available: true,
        limit: 999,
      },
      tenants: {
        available: true,
        limit: 1,
      },
      tenantProviders: {
        available: true,
        limit: 999,
      },
      tenantProviderPolicies: {
        available: true,
        limit: 999,
      },
      customDomain: {
        available: false,
        limit: 0,
      },
      signingKeys: {
        request: false,
        autoRotate: false,
      },
    },
  },
  [PLAN.PRO]: {
    id: PLAN.PRO,
    name: 'Pro',
    price: 9,
    features: {
      providers: {
        available: true,
        limit: 100,
      },
      providerClients: {
        available: true,
        limit: 9999,
      },
      tenants: {
        available: true,
        limit: 100,
      },
      tenantProviders: {
        available: true,
        limit: 9999,
      },
      tenantProviderPolicies: {
        available: true,
        limit: 9999,
      },
      customDomain: {
        available: true,
        limit: 1,
      },
      signingKeys: {
        request: true,
        autoRotate: false,
      },
    },
  },
  [PLAN.ULTIMATE]: {
    id: PLAN.ULTIMATE,
    name: 'Ultimate',
    price: 49,
    features: {
      providers: {
        available: true,
        limit: 1000,
      },
      providerClients: {
        available: true,
        limit: 99999,
      },
      tenants: {
        available: true,
        limit: 1000,
      },
      tenantProviders: {
        available: true,
        limit: 99999,
      },
      tenantProviderPolicies: {
        available: true,
        limit: 99999,
      },
      customDomain: {
        available: true,
        limit: 1,
      },
      signingKeys: {
        request: true,
        autoRotate: true,
      },
    },
  },
};

export type PlanFeatures = {
  id: PlanId;
  contents: string[];
};

const isSingular = (value: number) => value === 1;

export const PLAN_FEATURES: PlanFeatures[] = [
  {
    id: PLAN.FREE,
    contents: [
      `${PLANS[PLAN.FREE].features.providers.limit} ${isSingular(PLANS[PLAN.FREE].features.providers.limit) ? 'Provider' : 'Providers'}`,
      `${PLANS[PLAN.FREE].features.tenants.limit} ${isSingular(PLANS[PLAN.FREE].features.tenants.limit) ? 'Tenant' : 'Tenants'}`,
      `${PLANS[PLAN.FREE].features.providerClients.limit} clients per provider`,
      `${PLANS[PLAN.FREE].features.tenantProviders.limit} providers per tenant`,
      'Free forever',
      'API access',
    ],
  },
  {
    id: PLAN.PRO,
    contents: [
      `${PLANS[PLAN.PRO].features.providers.limit} Providers`,
      `${PLANS[PLAN.PRO].features.tenants.limit} Tenants`,
      'Unlimited clients per provider',
      'Unlimited providers per tenant',
      'Custom domain',
      'Request custom signing keys',
      'Priority support',
    ],
  },
  {
    id: PLAN.ULTIMATE,
    contents: [
      `Unlimited Providers`,
      `Unlimited Tenants`,
      'All in starter',
      'Auto Rotate signing keys',
      'Priority support 24/5',
    ],
  },
];

export const POPULAR_PLAN = PLANS.pro.id;
