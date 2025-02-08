import Link from 'next/link';

import * as providersDal from '@/data/providers';
import { Button } from '@/components/ui/button';

import ClientsList from './ClientsList';
import NoClients from './NoClients';

interface ProviderPageProps {
  params: Promise<{ providerId: string }>;
}

export default async function ProviderPage(props: ProviderPageProps) {
  const { providerId } = await props.params;
  const clients = await providersDal.getClients(providerId);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {clients.length > 0 && (
          <div className="flex">
            <h1 className="text-2xl font-medium">Clients</h1>
            <Button asChild className="ml-auto">
              <Link href={`/u/providers/${providerId}/clients/new`}>Create new client</Link>
            </Button>
          </div>
        )}
        <div className="mt-10">
          {clients.length === 0 && <NoClients providerId={providerId} />}
          {clients.length > 0 && <ClientsList clients={clients} providerId={providerId} />}
        </div>
      </div>
    </div>
  );
}
