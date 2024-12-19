import slugify from 'slugify';
import Sqids from 'sqids';

import { Domain } from '@/types/app.types';

import { PlanDetails } from './billing';

const sqids = new Sqids({
  alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
});

export const createUrlId = (name: string) => {
  const urlSuffix = sqids.encode([Date.now()]);
  return slugify(name, { lower: true }) + '-' + urlSuffix;
};

export const getIssuer = (
  urlId: string,
  planDetails: PlanDetails,
  customDomain?: Domain | null,
  forceDefaultDomain: boolean = false,
) => {
  if (customDomain && planDetails.customDomain && !forceDefaultDomain) {
    return `https://${customDomain.domain}`;
  }

  return `https://${urlId}.auth.usegrant.dev`;
};
