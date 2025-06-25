import Link from 'next/link';
import { KanbanIcon } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';

import ROUTES from '@/constants/routes';

interface NoPoliciesProps {
  id: string;
  tenantProviderId: string;
}

export default async function NoPolicies({ id, tenantProviderId }: NoPoliciesProps) {
  return (
    <div className="mt-20 flex h-96 flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <KanbanIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your first policy</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A policy is a set of conditions that are used to validate your authorization requests. You can add multiple
          unique policies to your tenant provider.
        </p>
        <Button className="mt-4" asChild>
          <Link href={ROUTES.TENANTS_ID_PROVIDERS_ID_ADD(id, tenantProviderId)}>Add policy</Link>
        </Button>
      </div>
    </div>
  );
}
