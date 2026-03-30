import { apiKey } from '@better-auth/api-key';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import { betterAuth } from 'better-auth/minimal';
import { nextCookies } from 'better-auth/next-js';
import { customSession, magicLink } from 'better-auth/plugins';
import { hoursToMilliseconds, hoursToSeconds, minutesToSeconds } from 'date-fns';
import { PostHog } from 'posthog-node';

import * as constants from '@/constants/cookies';
import env, { isLive } from '@/env';
import { daysToSeconds } from '@/utils/date';
import { generateLoginToken } from '@/utils/random';

import { getPlanByUserId } from './billing';
import db from './db';
import { sendChangeEmailConfirmation, sendEmailVerification, sendLoginEmail } from './email';

const posthog = new PostHog(env.POSTHOG_API_KEY, {
  host: 'https://us.i.posthog.com',
  flushAt: 1,
});

const database = prismaAdapter(db, {
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
    updateAccountOnSignIn: true,
  },
  emailVerification: {
    autoSignInAfterVerification: false,
    expiresIn: hoursToSeconds(1), // 1 hour
    async sendVerificationEmail(data) {
      await sendEmailVerification({ ...data, email: data.user.email });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailConfirmation(data) {
        await sendChangeEmailConfirmation({ ...data, email: data.user.email });
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: minutesToSeconds(5), // Cache duration in seconds
    },
    expiresIn: daysToSeconds(2),
  },
  plugins: [
    magicLink({
      generateToken: () => generateLoginToken(),
      expiresIn: minutesToSeconds(5),
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
        timeWindow: hoursToMilliseconds(1),
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
  telemetry: {
    enabled: false,
  },
});
