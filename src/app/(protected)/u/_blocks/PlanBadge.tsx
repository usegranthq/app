import { GemIcon } from 'lucide-react';
import Link from 'next/link';

import { getPlanDetails } from '@/data/user';
import { Badge } from '@/shadcn/components/ui/badge';

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
