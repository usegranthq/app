import 'server-only';

import { env } from '@/env';

export const getSiteUrl = () => {
  // if it is running in vercel preview, use the vercel preview url
  if (process.env.VERCEL_ENV === 'preview') {
    return process.env.VERCEL_URL;
  }

  return env.SITE_URL;
};

export const SITE_URL = getSiteUrl();
