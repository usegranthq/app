import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2Icon } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/shadcn/components/ui/button';

import ROUTES from '@/constants/routes';
import { verifyHMACState } from '@/utils/callbacks';
import polarClient from '@/lib/polar';
import env from '@/env';

export const redirectParamsSchema = z.object({
  checkout_id: z.string(),
  customer_session_token: z.string(),
  state: z.string(),
});

type RedirectParams = z.infer<typeof redirectParamsSchema>;

interface PaymentConfirmationProps {
  searchParams: SearchParams<RedirectParams>;
}

export default async function PaymentConfirmation({ searchParams }: PaymentConfirmationProps) {
  const queryParams = await searchParams;

  // validate entries
  const { success, data: params } = redirectParamsSchema.safeParse(queryParams);
  if (!success) {
    return notFound();
  }

  const isValidState = verifyHMACState(env.STATE_HMAC_SECRET_KEY, params.state);
  if (!isValidState) {
    return <div className="h-dvh flex flex-col items-center justify-center text-sm">Invalid/Expired state</div>;
  }

  try {
    // just checking if its a valid checkout
    const checkout = await polarClient.checkouts.get({ id: params.checkout_id });
    if (checkout.status !== 'succeeded') {
      throw new Error('Unsucessfull payment');
    }
  } catch {
    return <div className="h-dvh flex flex-col items-center justify-center text-sm">Invalid payment information</div>;
  }

  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <div className="text-center -mt-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-800/20">
          <CheckCircle2Icon className="size-8 text-green-600" />
        </div>
        <h1 className="text-xl font-medium">Payment successful</h1>
        <p className="mt-0.5 text-sm max-w-md text-muted-foreground">
          Payment processed. Your transaction was successful and your subscription will be updated shortly
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.SETTINGS_BILLING}>Go to billing</Link>
        </Button>
      </div>
    </div>
  );
}
