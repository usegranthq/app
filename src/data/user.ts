import 'server-only';

import { Session, User, Customer, Subscription } from '@/types/app.types';
import db from '@/lib/db';

import { verifySession } from './_verifySession';
import { findPlanByPlanName, PlanDetails } from '@/utils/billing';

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
    include: {
      Subscription: {
        where: {
          status: 'active',
        },
      },
    },
  });
};

export const getSubscription = async (): Promise<Subscription | null> => {
  const session = await verifySession();

  const customer = await db.customer.findUnique({
    where: { userId: session.user.id },
    include: {
      Subscription: {
        where: {
          status: 'active',
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  if (!customer) return null;

  return customer.Subscription[0] ?? null;
};

export const getPlanDetails = async (): Promise<PlanDetails> => {
  const session = await verifySession();
  return findPlanByPlanName(session.plan);
};
