import { Button } from '@/components/ui/button';
import { KanbanIcon } from 'lucide-react';
import Link from 'next/link';

interface NoIdpProps {
  id: string;
}

export default async function NoIdp({ id }: NoIdpProps) {
  return (
    <div className="-mt-14 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <KanbanIcon className="size-8" />
        <h1 className="text-2xl font-medium">Add your first identity provider</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          An identity provider is a service that validates your authorization requests. You can add multiple unique
          identity providers to your tenant.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/u/tenants/${id}/add`}>Add identity provider</Link>
        </Button>
      </div>
    </div>
  );
}
