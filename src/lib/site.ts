import 'server-only';

import { env } from '@/env';

export const getSiteUrl = (): string => {
  // if it is running in vercel preview, use the vercel preview url
  if (process.env.VERCEL_ENV === 'preview') {
    return (process.env.VERCEL_BRANCH_URL as string) ?? (process.env.VERCEL_URL as string);
  }

  return env.SITE_URL;
};

export const SITE_URL = getSiteUrl();
