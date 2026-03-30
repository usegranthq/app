import { CheckCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import z from 'zod';

import ROUTES from '@/constants/routes';
import env from '@/env';
import polarClient from '@/lib/polar';
import { Button } from '@/shadcn/components/ui/button';
import { verifyHMACState } from '@/utils/callbacks';

const redirectParamsSchema = z.object({
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
    return <div className="flex h-dvh flex-col items-center justify-center text-sm">Invalid/Expired state</div>;
  }

  try {
    // just checking if its a valid checkout
    const checkout = await polarClient.checkouts.get({ id: params.checkout_id });
    if (checkout.status !== 'succeeded') {
      throw new Error('Unsucessfull payment');
    }
  } catch {
    return <div className="flex h-dvh flex-col items-center justify-center text-sm">Invalid payment information</div>;
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="-mt-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-800/20">
          <CheckCircle2Icon className="size-8 text-green-600" />
        </div>
        <h1 className="text-xl font-medium">Transaction successful</h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Payment processed. Your transaction was successful and your subscription will be updated shortly
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.SETTINGS_BILLING}>Go to billing</Link>
        </Button>
      </div>
    </div>
  );
}
