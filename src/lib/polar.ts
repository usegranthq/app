import { createPolar } from '@polar-sh/sdk/2026-10';

import env from '@/env';

const polarClient = createPolar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});

export default polarClient;
