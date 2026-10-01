import { webhooks } from '@polar-sh/sdk/2026-10';

import db from '@/lib/db';
import logger from '@/lib/log';

class ProcessWebhook {
  async updateSubscriptionData(
    payload:
      | webhooks.WebhookSubscriptionActivePayload
      | webhooks.WebhookSubscriptionCanceledPayload
      | webhooks.WebhookSubscriptionUncanceledPayload
      | webhooks.WebhookSubscriptionRevokedPayload
      | webhooks.WebhookSubscriptionUpdatedPayload,
  ) {
    const polarSubscription = payload.data;
    const polarCustomer = polarSubscription.customer;

    if (!polarCustomer.external_id) {
      logger.error('Failed to process subscription data. External ID not found in polar customer records.');
      return;
    }

    const user = await db.user.findFirst({ where: { id: polarCustomer.external_id } });
    if (!user) {
      logger.error('Failed to process subscription data. User not found');
      return;
    }

    try {
      const customer = await db.customer.upsert({
        where: { userId: user.id },
        update: {
          customerRefId: polarCustomer.id,
        },
        create: {
          id: user.id,
          customerRefId: polarCustomer.id,
          userId: user.id,
        },
      });
      await db.subscription.upsert({
        where: { subscriptionRefId: polarSubscription.id, customerId: customer.id },
        update: {
          status: polarSubscription.status,
          productId: polarSubscription.product_id,
        },
        create: {
          subscriptionRefId: polarSubscription.id,
          status: polarSubscription.status,
          customerId: customer.id,
          productId: polarSubscription.product_id,
        },
      });
    } catch (error) {
      logger.error('Failed to process subscription data', error);
    }
  }
}

export default ProcessWebhook;
