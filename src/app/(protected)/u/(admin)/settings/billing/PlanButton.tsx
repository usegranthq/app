'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { PLAN, PLAN_FEATURES, PlanFeatures, PlanId, PLANS } from '@/utils/billing';
import { checkout } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';
import { Button } from '@/components/ui/button';

import CancelPlanButton from './CancelPlanButton';

interface PlanButtonProps {
  features: PlanFeatures;
  currentPlan: PlanId;
}

export default function PlanButton({ features, currentPlan }: PlanButtonProps) {
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

  if (currentPlan === features.id) {
    return (
      <Button disabled={true} className="min-w-32">
        Current Plan
      </Button>
    );
  }

  if (features.id === PLAN.FREE) {
    return <CancelPlanButton />;
  }

  const planIndex = PLAN_FEATURES.findIndex((p) => p.id === features.id);
  const currentPlanIndex = PLAN_FEATURES.findIndex((p) => p.id === currentPlan);
  const isDowngrade = planIndex < currentPlanIndex;

  const priceId = PLANS[features.id].productId as string;

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
