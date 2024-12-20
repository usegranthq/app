import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';

import db from '@/lib/db';
import { getCustomer } from '@/lib/paddle/subscription';

interface CustomerData {
  userId: string;
}

type CustomDataEvents =
  | CustomerCreatedEvent
  | CustomerUpdatedEvent
  | SubscriptionCreatedEvent
  | SubscriptionUpdatedEvent;

const createOrUpdateCustomer = async (customerId: string, userId: string) => {
  await db.customer.upsert({
    where: {
      userId: userId,
    },
    update: {},
    create: {
      paddleCustomerId: customerId,
      userId: userId,
    },
  });
};

const getCustomData = (eventData: CustomDataEvents): CustomerData | undefined => {
  const customData = eventData.data.customData as CustomerData | undefined;

  if (!customData || !customData.userId) {
    return undefined;
  }

  return customData;
};

const getCustomerId = async (
  eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent,
): Promise<string | undefined> => {
  const customer = await db.customer.findUnique({
    where: {
      paddleCustomerId: eventData.data.customerId,
    },
  });

  if (customer) {
    return customer.id;
  }

  const customerData = getCustomData(eventData);
  if (!customerData) {
    return;
  }

  try {
    const paddleCustomer = await getCustomer(eventData.data.customerId);
    // update customer since it doesn't exist in our database
    await createOrUpdateCustomer(paddleCustomer.id, customerData.userId);
    return paddleCustomer.id;
  } catch (e) {
    console.error('Failed to get customer', e);
    console.error('Customer not found', eventData);
    return undefined;
  }
};

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
    const customerData = getCustomData(eventData);
    if (!customerData) {
      return;
    }

    try {
      await createOrUpdateCustomer(eventData.data.id, customerData.userId);
    } catch (e) {
      console.error('Failed to update customer data', e);
    }
  }

  private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
    const customerId = await getCustomerId(eventData);
    if (!customerId) {
      console.error('Customer not found', eventData);
      return;
    }

    const data = {
      subscriptionStatus: eventData.data.status,
      priceId: eventData.data.items[0].price?.id ?? '',
      productId: eventData.data.items[0].price?.productId ?? '',
      scheduledChange: eventData.data.scheduledChange?.effectiveAt ?? null,
      customerId: customerId,
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
