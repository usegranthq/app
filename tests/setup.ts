import { afterAll, vi } from 'vitest';

import '@/lib/__mocks__/db';
import '@/lib/__mocks__/auth';
import '@/lib/__mocks__/cloudflare';

const mockEnvs = {
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/backend?pgbouncer=true&connect_timeout=15',
  SITE_URL: 'http://localhost:7500',
  POSTGRES_DATABASE: 'backend',
  POSTGRES_USER: 'postgres',
  POSTGRES_PASSWORD: 'postgres',
  POSTGRES_PORT: 5432,
  POSTGRES_HOST: 'localhost',
  POSTGRES_PRISMA_URL:
    'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?pgbouncer=true&connect_timeout=15',
  POSTGRES_URL_NON_POOLING:
    'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}',
  INVITE_TOKEN: 'zpm69-xxxx',
  JWT_SIGNING_SECRET: 'xxxx',
  TURNSTILE_SITE_KEY: '3x00000000000000000000FF',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  OAUTH_GITHUB_APP_CLIENT_ID: '0vxxxx',
  OAUTH_GITHUB_APP_CLIENT_SECRET: 'xxxx',
  OAUTH_GOOGLE_APP_CLIENT_ID: '0vxxxx',
  OAUTH_GOOGLE_APP_CLIENT_SECRET: 'xxxx',
  BETTER_AUTH_SECRET: 'xxxx',
  PROVIDER_DOMAIN: 'mockauth.usegrant.local',
  NODEMAILER_SMTP_URL: 'smtp://john.doe@ethereal.email:xxxx@smtp.ethereal.email:587',
  EMAIL_FROM: 'Usegrant <onboarding@usegrant.local>',
  RESEND_API_KEY: 're_xxxx',
  CLOUDFLARE_API_TOKEN: 'xxxx',
  CLOUDFLARE_ZONE_ID: 'xxxx',
  CRON_SECRET: 'xxxx',
  POLAR_ACCESS_TOKEN: 'xxxx',
  POLAR_WEBHOOK_SECRET: 'whsec_xxxx',
  POLAR_PRO_PLAN_PRODUCT_ID: 'prod_pro_xxxx',
  POLAR_ULTIMATE_PLAN_PRODUCT_ID: 'prod_ultimate_xxxx',
  POSTHOG_API_KEY: 'phc_xxxx',
  STATE_HMAC_SECRET_KEY: 'xxx',
  AXIOM_OTEL_DATASET: 'xxx',
  AXIOM_API_TOKEN: 'xxx',
};

for (const [key, value] of Object.entries(mockEnvs)) {
  vi.stubEnv(key, value as string);
}

afterAll(() => {
  for (const key of Object.keys(mockEnvs)) {
    vi.stubEnv(key, undefined);
  }
});

vi.mock('server-only', () => {
  return {
    // do nothing
  };
});
