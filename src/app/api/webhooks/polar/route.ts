import { Webhooks } from '@polar-sh/nextjs';

import env from '@/env';

import ProcessWebhook from './process-webhook';

const webhookProcessor = new ProcessWebhook();

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onSubscriptionActive: webhookProcessor.updateSubscriptionData,
  onSubscriptionCanceled: webhookProcessor.updateSubscriptionData,
  onSubscriptionUncanceled: webhookProcessor.updateSubscriptionData,
  onSubscriptionRevoked: webhookProcessor.updateSubscriptionData,
  onSubscriptionUpdated: webhookProcessor.updateSubscriptionData,
});
