import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import ROUTES from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureUnavailableProps extends PropsWithChildren {
  available: boolean;
  name: string;
  inline?: boolean;
}

export function FeatureUnavailable(props: FeatureUnavailableProps) {
  if (props.available) {
    return props.children;
  }

  return (
    <Card className={cn('w-full max-w-md rounded-md', { 'max-w-full border-0 p-0': props.inline })}>
      <CardHeader className={cn({ 'px-0': props.inline })}>
        <CardTitle>Upgrade to access this feature</CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-4', { 'p-0': props.inline })}>
        <p>
          The <span className="font-semibold">{props.name}</span> feature is not available in your current plan.
        </p>
        <Button asChild>
          <Link href={ROUTES.SETTINGS_BILLING} className="inline-flex items-center">
            Upgrade to use this feature
            <ArrowRight />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
