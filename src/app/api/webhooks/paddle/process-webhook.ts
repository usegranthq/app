import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';

import db from '@/lib/db';

interface CustomerData {
  userId: string;
}

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
    }
  }

  private async updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
    const customerData = eventData.data.customData as CustomerData | undefined;
    if (!customerData || !customerData.userId) {
      return;
    }

    try {
      await db.customer.upsert({
        where: {
          id: eventData.data.id,
        },
        update: {},
        create: {
          paddleCustomerId: eventData.data.id,
          userId: customerData.userId,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
    const customer = await db.customer.findUnique({
      where: {
        paddleCustomerId: eventData.data.customerId,
      },
    });

    if (!customer) {
      console.error('Customer not found', eventData);
      return;
    }

    const data = {
      subscriptionStatus: eventData.data.status,
      priceId: eventData.data.items[0].price?.id ?? '',
      productId: eventData.data.items[0].price?.productId ?? '',
      scheduledChange: eventData.data.scheduledChange?.effectiveAt ?? null,
      customerId: customer.id,
    };

    try {
      await db.subscription.upsert({
        where: {
          subscriptionId: eventData.data.id,
        },
        update: data,
        create: {
          subscriptionId: eventData.data.id,
          ...data,
        },
      });
    } catch (e) {
      console.error('Failed to update subscription data', e);
    }
  }
}

export default ProcessWebhook;
