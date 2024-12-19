import Link from 'next/link';

import { Button } from '@/components/ui/button';
import * as projectsDal from '@/data/projects';

import ClientsList from './ClientsList';
import NoClients from './NoClients';

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage(props: ProjectPageProps) {
  const { projectId } = await props.params;
  const clients = await projectsDal.getClients(projectId);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {clients.length > 0 && (
          <div className="flex">
            <h1 className="text-2xl font-medium">Clients</h1>
            <Button asChild className="ml-auto">
              <Link href={`/u/projects/${projectId}/clients/new`}>Create new client</Link>
            </Button>
          </div>
        )}
        <div className="mt-10">
          {clients.length === 0 && <NoClients projectId={projectId} />}
          {clients.length > 0 && <ClientsList clients={clients} projectId={projectId} />}
        </div>
      </div>
    </div>
  );
}
