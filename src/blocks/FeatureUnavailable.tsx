import { PropsWithChildren } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureUnavailableProps extends PropsWithChildren {
  available: boolean;
  name: string;
}

export function FeatureUnavailable(props: FeatureUnavailableProps) {
  if (props.available) {
    return props.children;
  }

  return (
    <Card className="w-full max-w-md rounded-md">
      <CardHeader>
        <CardTitle>Upgrade to access this feature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          The <span className="font-semibold">{props.name}</span> feature is not available in your current plan.
        </p>
        <Button asChild>
          <a href={'/u/settings/billing'} className="inline-flex items-center">
            Upgrade to use this feature
            <ArrowRight />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
