import db from '@/lib/db';
import { CreemCustomer, CreemSubscription, CreemWebhookEvent } from '@/types/creem.types';
import { Customer } from '@/types/app.types';

async function createOrUpdateCustomer(email: string, data: CreemCustomer): Promise<Customer> {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return db.customer.upsert({
    where: { userId: user.id },
    update: {
      customerRefId: data.id,
    },
    create: {
      id: user.id,
      customerRefId: data.id,
      userId: user.id,
    },
  });
}

async function createOrUpdateSubscription(customerId: string, data: CreemSubscription) {
  await db.subscription.upsert({
    where: { subscriptionRefId: data.id, customerId },
    update: {
      status: data.status,
    },
    create: {
      subscriptionRefId: data.id,
      status: data.status,
      customerId,
      productId: data.product.id,
    },
  });
}

export class ProcessWebhook {
  async processEvent(payload: CreemWebhookEvent) {
    switch (payload.eventType) {
      case 'subscription.active':
      case 'subscription.canceled':
      case 'subscription.expired':
        await this.updateSubscriptionData(payload.object);
        break;

      case 'checkout.completed':
      case 'subscription.paid':
      case 'refund.created':
        // not handling these events
        break;
    }
  }

  private async updateSubscriptionData(data: CreemSubscription) {
    const email = data.customer.email;
    try {
      const customer = await createOrUpdateCustomer(email, data.customer);
      await createOrUpdateSubscription(customer.id, data);
    } catch (error) {
      console.error('Failed to process subscription data', error);
    }
  }
}

export default ProcessWebhook;
