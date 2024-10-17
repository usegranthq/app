import { Button } from '@/components/ui/button';
import { KanbanIcon } from 'lucide-react';
import Link from 'next/link';

export default function NoProjects() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <KanbanIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your first project</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A project is like a isolated realm/provider where you can create multiple clients and get access to the API.
          Each project is like a seperated environment.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/u/new/projects">Create project</Link>
        </Button>
      </div>
    </div>
  );
}
