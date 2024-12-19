import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { magicLink, customSession } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

import { env } from '@/env';
import LoginEmail from '@/templates/LoginEmail';
import { findPlanByPriceId, Plan, PLAN } from '@/utils/billing';

import { prisma } from './db';
import { sendEmail } from './email';

const database = prismaAdapter(prisma, {
  provider: 'postgresql',
});

const getPlan = async (userId: string): Promise<Plan> => {
  const customer = await prisma.customer.findUnique({
    where: {
      userId,
    },
  });

  if (!customer) {
    return PLAN.FREE;
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      customerId: customer.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!subscription || subscription.subscriptionStatus !== 'active') {
    return PLAN.FREE;
  }

  return findPlanByPriceId(subscription.priceId);
};

export const auth = betterAuth({
  database,
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    magicLink({
      async sendMagicLink(data) {
        await sendEmail({
          to: data.email,
          subject: 'Login to Usergrant',
          template: <LoginEmail token={data.token} url={data.url} />,
        });
      },
    }),
    customSession(async ({ user, session }) => {
      const plan = await getPlan(user.id);

      return {
        session,
        user,
        plan,
      };
    }),
    nextCookies(), // must be last
  ],
  advanced: {
    cookiePrefix: '_ug',
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    },
  },
});
