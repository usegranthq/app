import Link from 'next/link';
import { CheckIcon } from 'lucide-react';

import { PLAN_FEATURES, PLANS, POPULAR_PLAN } from '@/utils/billing';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingSection() {
  return (
    <div className="mt-28 scroll-mt-28 md:mt-44" id="pricing">
      <h2 className="text-center text-3xl font-semibold md:text-4xl">Pricing</h2>
      <p className="mx-auto mt-2.5 max-w-lg text-pretty text-center text-sm font-medium text-muted-foreground">
        Simple and transparent pricing. No calculator needed. Way more affordable than running your own service for each
        oauth provider.
      </p>
      <div className="mx-auto max-w-5xl">
        <div className="mt-12 grid gap-10 sm:grid-cols-1 md:gap-14 lg:grid-cols-3 lg:items-center">
          {PLAN_FEATURES.map((features) => {
            const plan = PLANS[features.id];
            return (
              <Card key={features.id} className={cn('h-full', { 'border-primary': features.id === POPULAR_PLAN })}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex gap-0.5">
                    <h3 className="text-3xl font-bold">${plan.price}</h3>
                    <span className="mb-1 flex flex-col justify-end text-sm">{plan.price ? '/month' : null}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-7 space-y-2.5 text-sm">
                    {features.contents.map((content, index) => (
                      <li key={index} className="flex space-x-2">
                        <CheckIcon className="mt-0.5 size-4 flex-shrink-0" />
                        <span className="text-muted-foreground">{content}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-8 text-center font-mono text-sm text-muted-foreground">All prices in USD, excl. taxes</p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Contact{' '}
          <Link href="mailto:support@usegrant.dev" className="underline-offset-4 hover:underline">
            support@usegrant.dev
          </Link>{' '}
          for annual pricing and discounts
        </p>
      </div>
    </div>
  );
}
