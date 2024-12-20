'use client';

import { startTransition, useEffect, useState } from 'react';
import { CheckoutEventNames, initializePaddle, InitializePaddleOptions, Paddle } from '@paddle/paddle-js';
import { toast } from 'sonner';

import { env } from '@/env';
import { updateAfterCheckout } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';

export default function usePaddle(email: string) {
  const [paddle, setPaddle] = useState<Paddle>();
  const progress = useProgressBar();

  useEffect(() => {
    if (paddle?.Initialized) return;

    const options: InitializePaddleOptions = {
      environment: env.NEXT_PUBLIC_PADDLE_ENV,
      token: env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      checkout: {
        settings: {
          successUrl: '/u/settings/billing/subscription',
          allowLogout: false,
          variant: 'one-page',
          // displayMode: 'inline',
          // frameTarget: 'checkout-container',
          // frameInitialHeight: 450,
          // frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
        },
      },
      pwCustomer: {
        email,
      },
      eventCallback: (event) => {
        const data = event.data;

        if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED && data) {
          const customerId = data.customer.id;
          const transactionId = data.transaction_id;

          console.log('CHECKOUT_COMPLETED', customerId, transactionId);
          if (!customerId || !transactionId) {
            toast.error('Failed to update subscription. Please reload the page and try again.');
            return;
          }

          startTransition(async () => {
            progress.start();
            void updateAfterCheckout(customerId, transactionId);
          });
        }
      },
    };

    initializePaddle(options).then((paddleInstance: Paddle | undefined) => {
      if (!paddleInstance) {
        return;
      }
      setPaddle(paddleInstance);
    });
  }, []);

  return paddle;
}
