import { Environment, LogLevel, Paddle, PaddleOptions } from '@paddle/paddle-node-sdk';

import { env } from '@/env';

export function getPaddleInstance() {
  const paddleOptions: PaddleOptions = {
    environment: (env.NEXT_PUBLIC_PADDLE_ENV as Environment) ?? Environment.sandbox,
    logLevel: LogLevel.error,
  };

  if (!env.PADDLE_API_KEY) {
    console.error('Paddle API key is missing');
  }

  return new Paddle(env.PADDLE_API_KEY, paddleOptions);
}
