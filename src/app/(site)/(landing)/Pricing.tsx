import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

const Plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['1 Project', 'Free forever', 'API access to create clients'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$9/m',
    features: ['10 Projects', 'Custom domains', 'Priority support 24/5', 'Token introspection (coming soon)'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49/m',
    features: [
      '100 Projects',
      'All in starter',
      'Create projects on the fly',
      'Request unique signing key per project (coming soon)',
      'Priority support',
    ],
  },
];

export default function PricingSection() {
  return (
    <div className="mt-28 md:mt-44">
      <h2 className="text-center text-3xl font-semibold md:text-4xl">Worry about your auth, not your bill.</h2>
      <p className="mx-auto mt-2.5 max-w-lg text-pretty text-center text-sm font-medium text-muted-foreground">
        Our pricing is simple and transparent. No calculator needed. Way more affordable than running your own service.
      </p>
      <div className="mx-auto max-w-5xl">
        <div className="mt-12 grid gap-10 sm:grid-cols-1 md:gap-14 lg:grid-cols-3 lg:items-center">
          {Plans.map((plan) => (
            <Card key={plan.id} className={cn('h-full', { 'border-primary': plan.id === 'starter' })}>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="mb-5 text-lg font-medium">{plan.name}</CardTitle>
                <span className="text-3xl font-bold">{plan.price}</span>
              </CardHeader>
              <CardContent>
                <ul className="mt-7 space-y-2.5 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-2">
                      <CheckIcon className="mt-0.5 size-4 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center font-mono text-sm text-muted-foreground">All prices in USD</p>
      </div>
    </div>
  );
}
