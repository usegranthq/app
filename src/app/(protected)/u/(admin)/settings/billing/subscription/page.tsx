import { setTimeout } from 'node:timers/promises';
import Link from 'next/link';

import { getCustomer, getSubscription } from '@/data/user';
import { Button } from '@/components/ui/button';

const getSubscriptionWithRetries = async (attempts: number = 1) => {
  const customer = await getCustomer();
  const subscription = await getSubscription(customer);
  if (subscription) return subscription;

  if (attempts > 5) return null;
  await setTimeout(3000);
  return getSubscriptionWithRetries(attempts + 1);
};

export default async function BillingSubscriptionPage() {
  const subscription = await getSubscriptionWithRetries();

  if (!subscription)
    return (
      <div className="flex h-44 flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <p className="">Failed to get subscription status. Try reloading the page.</p>
          <p className="mb-4 text-sm text-muted-foreground">
            If the amount is debited and still doesn&apos;t show up even after 10 minutes, please contact support.
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex h-44 flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl font-medium">Your subscription is active.</p>
        <Button asChild>
          <Link href="/u/settings/billing">Back to billing</Link>
        </Button>
      </div>
    </div>
  );
}
