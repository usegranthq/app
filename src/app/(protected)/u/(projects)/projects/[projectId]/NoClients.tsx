import { Button } from '@/components/ui/button';
import { UserPlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function NoClients({ projectId }: { projectId: string }) {
  return (
    <div className="flex h-80 items-center justify-center">
      <div className="flex flex-col items-center">
        <UserPlusIcon className="size-10 text-muted-foreground" />
        <h2 className="mt-2 text-lg font-semibold">No clients found</h2>
        <p className="text-sm text-muted-foreground">You don&apos;t have any clients for this project.</p>
        <Button asChild className="mt-4">
          <Link href={`/u/projects/${projectId}/clients/new`}>Create a client</Link>
        </Button>
      </div>
    </div>
  );
}
