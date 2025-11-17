'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';

import { PLAN, PLAN_FEATURES, PlanFeatures, PlanId } from '@/utils/billing';
import { checkout, upgradePlan } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';

import CancelPlanButton from './CancelPlanButton';

interface PlanButtonProps {
  id: PlanId;
  currentPlan: PlanId;
  features: PlanFeatures;
}

export default function PlanButton({ id, features, currentPlan }: PlanButtonProps) {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();

  const handleCheckout = (planId: PlanId) => {
    startTransition(async () => {
      progress.start();
      const [errorMessage, sessionURL] = await checkout(planId);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      window.location.href = sessionURL!;
    });
  };

  const handleUpgrade = (planId: PlanId) => {
    startTransition(async () => {
      progress.start();
      const [errorMessage] = await upgradePlan(planId);
      if (errorMessage) {
        toast.error(errorMessage);
      }
    });
  };

  const handleCheckoutClick = (planId: PlanId) => {
    if (currentPlan === PLAN.FREE) {
      return handleCheckout(planId);
    }

    handleUpgrade(planId);
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

  return (
    <Button disabled={isPending} className="min-w-32" onClick={() => handleCheckoutClick(id)}>
      {isDowngrade ? 'Downgrade' : 'Upgrade'}
    </Button>
  );
}
