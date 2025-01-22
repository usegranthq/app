'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { PLAN, PlanName, PlanData, Plans } from '@/utils/billing';
import { checkout } from '@/actions';
import { Button } from '@/components/ui/button';
import { useProgressBar } from '@/blocks/NavProgress';

import CancelPlanButton from './CancelPlanButton';

interface PlanButtonProps {
  plan: PlanData;
  currentPlan: PlanName;
}

export default function PlanButton({ plan, currentPlan }: PlanButtonProps) {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();

  const handleCheckoutClick = (productId: string) => {
    startTransition(async () => {
      progress.start();
      const [errorMessage] = await checkout(productId);
      if (errorMessage) {
        toast.error(errorMessage);
      }
    });
  };

  if (currentPlan === plan.id) {
    return (
      <Button disabled={true} className="min-w-32">
        Current Plan
      </Button>
    );
  }

  if (plan.id === PLAN.FREE) {
    return <CancelPlanButton />;
  }

  const planIndex = Plans.findIndex((p) => p.id === plan.id);
  const currentPlanIndex = Plans.findIndex((p) => p.id === currentPlan);
  const isDowngrade = planIndex < currentPlanIndex;

  const priceId = plan.productId as string;

  if (currentPlan === PLAN.FREE) {
    return (
      <Button className="min-w-32" onClick={() => handleCheckoutClick(priceId)} disabled={isPending}>
        Upgrade
      </Button>
    );
  }

  return (
    <Button disabled={!isDowngrade || isPending} className="min-w-32" onClick={() => handleCheckoutClick(priceId)}>
      {isDowngrade ? 'Downgrade' : 'Upgrade'}
    </Button>
  );
}
