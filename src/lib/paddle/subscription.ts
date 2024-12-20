import { setTimeout } from 'node:timers/promises';

import { Customer, Subscription, Transaction } from '@paddle/paddle-node-sdk';

import { getPaddleInstance } from './get-instance';

export const cancelSubscription = async (subscriptionId: string): Promise<Subscription> => {
  const paddle = getPaddleInstance();

  const subscription = await paddle.subscriptions.cancel(subscriptionId, {
    effectiveFrom: 'immediately',
  });

  return subscription;
};

export const getTransaction = async (transactionId: string): Promise<Transaction> => {
  const paddle = getPaddleInstance();
  return paddle.transactions.get(transactionId);
};

export const getSubscription = async (subscriptionId: string): Promise<Subscription> => {
  const paddle = getPaddleInstance();
  return paddle.subscriptions.get(subscriptionId);
};

// sometimes paddle takes a while to update the subscription in the transaction
// so trying to get the subscription by transaction with a few retries
export const getSubscriptionByTransactionId = async (transactionId: string): Promise<Subscription> => {
  let attempts = 1;

  const transaction = await getTransaction(transactionId);
  if (!transaction.subscriptionId) {
    if (attempts > 3) {
      throw new Error('Transaction does not have a subscription');
    }

    attempts++;
    await setTimeout(200); // Wait for 200ms before retrying
    return getSubscriptionByTransactionId(transactionId);
  }

  return getSubscription(transaction.subscriptionId);
};

export const getCustomer = async (customerId: string): Promise<Customer> => {
  const paddle = getPaddleInstance();
  return paddle.customers.get(customerId);
};
