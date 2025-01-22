import { NextRequest } from 'next/server';

import { env } from '@/env';

import ProcessWebhook from './process-webhook';
import { generateWebhookSignature } from '@/lib/creem';

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
  const signature = request.headers.get('creem-signature') || '';
  const payload = await request.json();

  const generatedSignature = generateWebhookSignature(payload, env.CREEM_WEBHOOK_SECRET);
  if (generatedSignature !== signature) {
    return Response.json({ message: 'Invalid webhook signature' }, { status: 400 });
  }

  let status = 200;
  let eventName = 'unknown.event';

  try {
    if (payload.eventType) {
      eventName = payload.eventType;
      await webhookProcessor.processEvent(payload);
    }
  } catch (e) {
    // Handle error
    status = 500;
    console.error(e);
  }

  return Response.json({ eventName }, { status });
}
