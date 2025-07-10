import 'server-only';

import env from '@/env';

export const getSiteUrl = (): string => {
  // if it is running in vercel preview, use the vercel preview url
  if (process.env.VERCEL_ENV === 'preview') {
    const domain = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL;
    return `https://${domain}`;
  }

  return env.SITE_URL;
};

export const SITE_URL = getSiteUrl();
