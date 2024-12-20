import { CheckIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { PLAN, PlanDetails, Plans } from '@/utils/billing';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Customer } from '@/types/app.types';

import PlanButton from './PlanButton';

interface BillingProps {
  customer: Customer | null;
  plan: PlanDetails;
}

export default function Billing({ customer, plan }: BillingProps) {
  const currentPlan = plan.id;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You are currently on the <span className="font-mono font-semibold uppercase">{currentPlan}</span> plan.
      </p>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3">
        {Plans.map((plan) => (
          <Card key={plan.id} className="flex h-full flex-col rounded-none first:rounded-l-md last:rounded-r-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex gap-0.5">
                <h3 className="text-3xl font-bold">${plan.price}</h3>
                <span className="mb-1 flex flex-col justify-end text-sm">{plan.price ? '/month' : null}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex space-x-2">
                    <CheckIcon className="mt-0.5 size-4 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-5 justify-center">
              <PlanButton plan={plan} currentPlan={currentPlan} customer={customer} />
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="my-10 flex flex-col gap-2 text-sm text-muted-foreground">
        {currentPlan !== PLAN.FREE && (
          <p>You can upgrade to a new plan, after downgrading to free plan and then subscribing again.</p>
        )}
        <p>
          Get in touch, if you need to create more than 100 projects or have any other questions. Contact us via{' '}
          <Link href="mailto:support@usegrant.dev" className="underline underline-offset-4 hover:text-primary">
            support@usegrant.dev
          </Link>
          . Pricing might not change, but just to understand the use case and provision resources as needed.
        </p>
      </div>
    </div>
  );
}
