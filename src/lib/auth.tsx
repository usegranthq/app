import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { magicLink } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

import LoginEmail from '@/templates/LoginEmail';

import { prisma } from './db';
import { sendEmail } from './email';

const database = prismaAdapter(prisma, {
  provider: 'postgresql',
});

export const auth = betterAuth({
  database,
  account: {
    accountLinking: {
      enabled: true,
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
    nextCookies(), // must be last
  ],
  session: {
    additionalFields: {
      createdAt: {
        type: 'string',
      },
    },
  },
  advanced: {
    cookiePrefix: '_ug',
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    },
  },
});
