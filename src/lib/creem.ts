import crypto from 'crypto';
import ky from 'ky';
import { z } from 'zod';

import { env, isLive } from '@/env';
import * as CreemTypes from '@/types/creem.types';

import { SITE_URL } from './site';

const CREEM_PROD_URL = 'https://api.creem.io';
const CREEM_TEST_URL = 'https://test-api.creem.io';

export const CREEMS_API_URL = isLive ? CREEM_PROD_URL : CREEM_TEST_URL;
const SUCCESS_URL = new URL('/api/callbacks/billing/success', SITE_URL).toString();

const instance = ky.create({
  prefixUrl: CREEMS_API_URL,
  headers: {
    'x-api-key': env.CREEM_API_KEY,
  },
});

export const redirectParamsSchema = z.object({
  checkout_id: z.string(),
  order_id: z.string(),
  customer_id: z.string(),
  subscription_id: z.string(),
  product_id: z.string(),
  signature: z.string(),
});

export type RedirectParams = z.infer<typeof redirectParamsSchema>;

export const generateRequestSignature = (payload: Record<string, string>, secret: string): string => {
  // delete signature from payload if exists
  const paramsWithoutSignature = Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'signature'));

  const data = Object.entries(paramsWithoutSignature)
    .map(([key, value]) => `${key}=${value}`)
    .concat(`salt=${secret}`)
    .join('|');

  return crypto.createHash('sha256').update(data).digest('hex');
};

export const generateWebhookSignature = (payload: Record<string, string>, secret: string): string => {
  const data = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const createCheckoutSession = async (
  email: string,
  productId: string,
): Promise<CreemTypes.CreemCheckoutSession> => {
  const payload: CreemTypes.CreemCheckoutSessionPayload = {
    customer: { email },
    product_id: productId,
    success_url: SUCCESS_URL,
  };

  return instance.post<CreemTypes.CreemCheckoutSession>('v1/checkouts', { json: payload }).json();
};

export const getSubscription = async (id: string): Promise<CreemTypes.CreemSubscription> => {
  return instance.get('v1/subscriptions', { searchParams: { subscription_id: id } }).json();
};

export const cancelSubscription = async (id: string): Promise<CreemTypes.CreemSubscription> => {
  return instance.post(`v1/subscriptions/${id}/cancel`).json();
};

export const getCustomerPortalUrl = async (id: string): Promise<string> => {
  const response = await instance
    .post<CreemTypes.CreemCustomerPortal>(`v1/customers/billing`, { json: { customer_id: id } })
    .json();
  return response.customer_portal_link;
};
