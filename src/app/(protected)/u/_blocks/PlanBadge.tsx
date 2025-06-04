import Link from 'next/link';
import { GemIcon } from 'lucide-react';

import { Badge } from '@/shadcn/components/ui/badge';

import { getPlanDetails } from '@/data/user';

export default async function PlanBadge() {
  const plan = await getPlanDetails();

  return (
    <Link href="/u/settings/billing">
      <Badge variant="secondary">
        <GemIcon />
        {plan.id === 'free' ? 'Upgrade' : `You are on ${plan.id} plan`}
      </Badge>
    </Link>
  );
}
