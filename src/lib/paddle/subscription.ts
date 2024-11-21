import { Subscription, Transaction } from '@paddle/paddle-node-sdk';

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

export const getSubscriptionByTransactionId = async (transactionId: string): Promise<Subscription> => {
  const transaction = await getTransaction(transactionId);

  if (!transaction.subscriptionId) {
    throw new Error('Transaction does not have a subscription');
  }

  return getSubscription(transaction.subscriptionId);
};
