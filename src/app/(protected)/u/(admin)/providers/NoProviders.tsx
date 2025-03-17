import Link from 'next/link';
import { KanbanIcon } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';

export default function NoProviders() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <KanbanIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your first provider</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A provider is an isolated entity where you can create multiple clients. Generate access tokens for your
          clients to access your services.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/u/providers/new">Create provider</Link>
        </Button>
      </div>
    </div>
  );
}
