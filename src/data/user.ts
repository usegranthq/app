import 'server-only';

import { Session, User, Customer, Subscription } from '@/types/app.types';
import db from '@/lib/db';

import { verifySession } from './_verifySession';

export const getUser = async (): Promise<User> => {
  const session = await verifySession();
  return session.user;
};

export const getSessions = async (): Promise<Session[]> => {
  const session = await verifySession();

  const sessions = await db.session.findMany({
    where: {
      userId: session.user.id,
      NOT: {
        id: session.session.id,
      },
    },
  });

  return sessions;
};

export const getCustomer = async (): Promise<Customer | null> => {
  const session = await verifySession();
  return db.customer.findUnique({
    where: { userId: session.user.id },
  });
};

export const getSubscription = async (customer: Customer | null): Promise<Subscription | null> => {
  await verifySession();
  if (!customer) return null;

  return db.subscription.findFirst({
    where: {
      customerId: customer.id,
      subscriptionStatus: 'active',
    },
  });
};
