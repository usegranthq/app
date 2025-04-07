import Link from 'next/link';
import { KanbanIcon } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';

export default function NoTenants() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <KanbanIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your first tenant</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A tenant is an organizational unit where you can configure multiple OIDC providers, each with unique identity
          providers to validate your authorization requests.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/u/tenants/new">Create tenant</Link>
        </Button>
      </div>
    </div>
  );
}
