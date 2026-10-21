import slugify from 'slugify';
import Sqids from 'sqids';

import env from '@/env';
import { Domain } from '@/types/app.types';

import { withProtocol } from './url';

const sqids = new Sqids({
  alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
});

export const createUrlId = (name: string) => {
  const urlSuffix = sqids.encode([Date.now()]);
  return slugify(name, { lower: true, strict: true }) + '-' + urlSuffix;
};

export const getIssuer = (urlId: string, customDomain?: Domain | null, forceDefaultDomain: boolean = false) => {
  if (customDomain && !forceDefaultDomain) {
    return `https://${customDomain.domain}`;
  }

  return new URL(urlId, withProtocol(env.PROVIDER_DOMAIN)).href;
};
