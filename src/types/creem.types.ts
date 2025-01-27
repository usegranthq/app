export interface CreemProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  currency: string;
  billing_type: string;
  billing_period: string;
  status: string;
  tax_mode: string;
  tax_category: string;
  default_success_url: string;
  created_at: string;
  updated_at: string;
  mode: string;
}

export interface CreemCustomer {
  id: string;
  mode: string;
  object: string;
  email: string;
  name: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface CreemOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
  mode: string;
}

export interface CreemItem {
  id: string;
  mode: string;
  object: string;
  product_id: string;
  price_id: string;
  units: number;
}

export interface CreemSubscription {
  id: string;
  mode: string;
  object: 'subscription';
  product: CreemProduct;
  customer: CreemCustomer;
  items: CreemItem[];
  collection_method: string;
  status: 'active' | 'canceled' | 'unpaid' | 'paused' | 'trialing';
  last_transaction_id: string;
  last_transaction_date: string;
  next_transaction_date: string;
  current_period_start_date: string;
  current_period_end_date: string;
  canceled_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreemCheckout {
  id: string;
  object: 'checkout';
  request_id: string;
  order: CreemOrder;
  product: CreemProduct;
  customer: CreemCustomer;
  subscription: Pick<CreemSubscription, 'id' | 'status'>;
  custom_fields: unknown[];
  status: string;
  metadata: Record<string, unknown>;
  mode: string;
}

export interface CreemCustomerPortal {
  customer_portal_link: string;
}

export interface CreemCustomerCheckout {
  email: string;
}

export interface CreemCheckoutSessionPayload {
  customer: CreemCustomerCheckout;
  product_id: string;
  success_url: string;
}

export interface CreemCheckoutSession {
  id: string;
  object: 'checkout';
  product: string;
  units: null;
  status: string;
  checkout_url: string;
  mode: string;
}

type CreemWebhookEvents =
  | 'checkout.completed'
  | 'subscription.active'
  | 'subscription.paid'
  | 'subscription.canceled'
  | 'subscription.expired'
  | 'refund.created';

type BaseCreemWebhookEvent<E extends CreemWebhookEvents, T> = {
  id: string;
  created_at: string;
  eventType: E;
  object: T;
};

export type CreemCheckoutCompletedEvent = BaseCreemWebhookEvent<'checkout.completed', CreemCheckout>;
export type CreemSubscriptionEvent = BaseCreemWebhookEvent<
  'subscription.active' | 'subscription.paid' | 'subscription.canceled' | 'subscription.expired',
  CreemSubscription
>;
export type CreemRefundCreatedEvent = BaseCreemWebhookEvent<'refund.created', never>;

export type CreemWebhookEvent = CreemCheckoutCompletedEvent | CreemSubscriptionEvent | CreemRefundCreatedEvent;
