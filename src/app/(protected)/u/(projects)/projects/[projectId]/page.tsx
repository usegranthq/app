import Link from 'next/link';

import api from '@/lib/api';
import RecentProjectTracker from './_blocks/RecentProjectTracker';
import { Button } from '@/components/ui/button';

import ClientsList from './ClientsList';
import { Client } from '@/types/app.types';
import NoClients from './NoClients';

interface ProjectPageProps {
  params: { projectId: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const clients = await api.get<Client[]>(`v1/u/projects/${params.projectId}/clients`).json();

  return (
    <div>
      <RecentProjectTracker projectId={params.projectId} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        {clients.length > 0 && (
          <div className="flex">
            <h1 className="text-2xl font-medium">Clients</h1>
            <Button asChild className="ml-auto">
              <Link href={`/u/projects/${params.projectId}/clients/new`}>Create new client</Link>
            </Button>
          </div>
        )}
        <div className="mt-10">
          {clients.length === 0 && <NoClients projectId={params.projectId} />}
          {clients.length > 0 && <ClientsList clients={clients} projectId={params.projectId} />}
        </div>
      </div>
    </div>
  );
}
