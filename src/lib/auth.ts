import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, customSession, magicLink } from 'better-auth/plugins';
import { PostHog } from 'posthog-node';

import * as constants from '@/constants/cookies';
import { generateLoginToken } from '@/utils/random';
import { env, isLive } from '@/env';

import { getPlanByUserId } from './billing';
import { prisma } from './db';
import { sendLoginEmail } from './email';
import { getSiteUrl } from './site';

const posthog = new PostHog(env.POSTHOG_API_KEY, {
  host: 'https://us.i.posthog.com',
  flushAt: 1,
});

const database = prismaAdapter(prisma, {
  provider: 'postgresql',
});

export const auth = betterAuth({
  baseURL: getSiteUrl(),
  secret: env.BETTER_AUTH_SECRET,
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
      generateToken: () => generateLoginToken(),
      expiresIn: 5 * 60, // 5 minutes,
      async sendMagicLink(data) {
        await sendLoginEmail(data);
      },
    }),
    customSession(async ({ user, session }) => {
      const plan = await getPlanByUserId(user.id);

      return {
        session,
        user,
        plan,
      };
    }),
    apiKey({
      rateLimit: {
        // allow 1000 requests per hour
        enabled: true,
        timeWindow: 1000 * 60 * 60, // 1 hour in milliseconds
        maxRequests: 1000, // max requests in the window
      },
    }),
    nextCookies(), // must be last
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!isLive) return;

          posthog.capture({
            distinctId: user.id,
            event: 'user_signed_up',
            properties: {
              $set: {
                email: user.email,
              },
            },
          });
        },
      },
    },
  },
  advanced: {
    cookiePrefix: constants.COOKIE_PREFIX,
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
    },
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
