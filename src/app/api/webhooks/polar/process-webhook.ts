import { WebhookSubscriptionActivePayload } from '@polar-sh/sdk/models/components/webhooksubscriptionactivepayload';
import { WebhookSubscriptionCanceledPayload } from '@polar-sh/sdk/models/components/webhooksubscriptioncanceledpayload';
import { WebhookSubscriptionRevokedPayload } from '@polar-sh/sdk/models/components/webhooksubscriptionrevokedpayload';
import { WebhookSubscriptionUncanceledPayload } from '@polar-sh/sdk/models/components/webhooksubscriptionuncanceledpayload';
import { WebhookSubscriptionUpdatedPayload } from '@polar-sh/sdk/models/components/webhooksubscriptionupdatedpayload';

import db from '@/lib/db';

export class ProcessWebhook {
  async updateSubscriptionData(
    payload:
      | WebhookSubscriptionActivePayload
      | WebhookSubscriptionCanceledPayload
      | WebhookSubscriptionUncanceledPayload
      | WebhookSubscriptionRevokedPayload
      | WebhookSubscriptionUpdatedPayload,
  ) {
    const polarSubscription = payload.data;
    const polarCustomer = polarSubscription.customer;

    if (!polarCustomer.externalId) {
      console.error('Failed to process subscription data. External ID not found in polar customer records.');
      return;
    }

    const user = await db.user.findFirst({ where: { id: polarCustomer.externalId } });
    if (!user) {
      console.error('Failed to process subscription data. User not found');
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
          productId: polarSubscription.productId,
        },
        create: {
          subscriptionRefId: polarSubscription.id,
          status: polarSubscription.status,
          customerId: customer.id,
          productId: polarSubscription.productId,
        },
      });
    } catch (error) {
      console.error('Failed to process subscription data', error);
    }
  }
}

export default ProcessWebhook;
