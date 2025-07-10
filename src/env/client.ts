import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  client: {
    NEXT_PUBLIC_POLAR_PRO_PLAN_PRODUCT_ID: z.string(),
    NEXT_PUBLIC_POLAR_ULTIMATE_PLAN_PRODUCT_ID: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_POLAR_PRO_PLAN_PRODUCT_ID: process.env.NEXT_PUBLIC_POLAR_PRO_PLAN_PRODUCT_ID,
    NEXT_PUBLIC_POLAR_ULTIMATE_PLAN_PRODUCT_ID: process.env.NEXT_PUBLIC_POLAR_ULTIMATE_PLAN_PRODUCT_ID,
  },
  emptyStringAsUndefined: true,
});

export default env;
