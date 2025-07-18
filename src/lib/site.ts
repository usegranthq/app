import env from '@/env';

export const getSiteUrl = (): string => {
  return env.SITE_URL;
};

export const SITE_URL = getSiteUrl();
