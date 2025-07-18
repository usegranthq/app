import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, customSession, magicLink } from 'better-auth/plugins';
import { PostHog } from 'posthog-node';

import * as constants from '@/constants/cookies';
import { generateLoginToken } from '@/utils/random';
import env, { isLive } from '@/env';

import { getPlanByUserId } from './billing';
import { prisma } from './db';
import { sendChangeEmailVerification, sendEmailVerification, sendLoginEmail } from './email';

const posthog = new PostHog(env.POSTHOG_API_KEY, {
  host: 'https://us.i.posthog.com',
  flushAt: 1,
});

const database = prismaAdapter(prisma, {
  provider: 'postgresql',
});

export { APIError as BetterAuthAPIError };

export const auth = betterAuth({
  baseURL: env.SITE_URL,
  secret: env.BETTER_AUTH_SECRET,
  database,
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: false,
    },
  },
  emailVerification: {
    autoSignInAfterVerification: false,
    expiresIn: 3600, // 1 hour
    async sendVerificationEmail(data) {
      await sendEmailVerification({ ...data, email: data.user.email });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification(data) {
        await sendChangeEmailVerification({ ...data, email: data.user.email });
      },
    },
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
      apiKeyHeaders: [],
      rateLimit: {
        // allow 1000 requests per hour
        enabled: true,
        timeWindow: 1000 * 60 * 60, // 1 hour in milliseconds
        maxRequests: 1000, // max requests in the window
      },
      customAPIKeyValidator: ({ key }) => {
        return key.startsWith('uga_');
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
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: 'Strict',
    },
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  socialProviders: {
    github: {
      clientId: env.OAUTH_GITHUB_APP_CLIENT_ID,
      clientSecret: env.OAUTH_GITHUB_APP_CLIENT_SECRET,
    },
    google: {
      clientId: env.OAUTH_GOOGLE_APP_CLIENT_ID,
      clientSecret: env.OAUTH_GOOGLE_APP_CLIENT_SECRET,
    },
  },
});
