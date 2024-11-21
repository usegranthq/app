'use client';

import { CheckoutCustomer, Theme } from '@paddle/paddle-js';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { PLAN, Plan, PlanData, Plans } from '@/utils/billing';
import { Customer } from '@/types/app.types';
import { useUser } from '@/contexts/User';
import { Button } from '@/components/ui/button';

import usePaddle from './client';
import CancelPlanButton from './CancelPlanButton';

interface PlanButtonProps {
  plan: PlanData;
  currentPlan: Plan;
  customer: Customer | null;
}

export default function PlanButton({ plan, currentPlan, customer }: PlanButtonProps) {
  const paddle = usePaddle();
  const theme = useTheme();
  const user = useUser();

  const isInitialized = !!paddle;
  const paddleTheme = (theme.resolvedTheme ?? 'dark') as Theme;

  const handleCheckoutClick = (priceId: string) => {
    if (!isInitialized) {
      toast.error('Uh oh! Failed to initialize billing module. Try reloading the page or contact support.');
      return;
    }

    const paddleCustomer: CheckoutCustomer = customer?.paddleCustomerId
      ? { id: customer.paddleCustomerId }
      : { email: user.email };

    paddle.Checkout.open({
      items: [
        {
          priceId,
          quantity: 1,
        },
      ],
      customer: paddleCustomer,
      customData: {
        userId: user.id,
      },
      settings: {
        theme: paddleTheme,
      },
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

  const priceId = plan.priceId as string;

  if (currentPlan === PLAN.FREE) {
    return (
      <Button className="min-w-32" onClick={() => handleCheckoutClick(priceId)}>
        Upgrade
      </Button>
    );
  }

  return (
    <Button disabled={!isDowngrade} className="min-w-32" onClick={() => handleCheckoutClick(priceId)}>
      {isDowngrade ? 'Downgrade' : 'Upgrade'}
    </Button>
  );
}
