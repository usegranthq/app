import { Button } from '@/components/ui/button';
import { KanbanIcon } from 'lucide-react';
import Link from 'next/link';

export default function NoProviders() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <KanbanIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your first provider</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A provider is like a isolated realm where you can create multiple clients and get access to the API. Each
          provider is a seperated entity.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/u/providers/new">Create provider</Link>
        </Button>
      </div>
    </div>
  );
}
