import Link from 'next/link';

import * as providersDal from '@/data/providers';
import { normalizePaginationParams } from '@/utils/pagination';
import { Button } from '@/components/ui/button';

import ClientsList from './ClientsList';
import NoClients from './NoClients';

interface ProviderPageProps {
  params: Params<{ providerId: string }>;
  searchParams: SearchParams<PaginationProps>;
}

export default async function ProviderPage(props: ProviderPageProps) {
  const { providerId } = await props.params;
  const queryParams = await props.searchParams;

  const { page, limit } = normalizePaginationParams(queryParams);
  const [clients, pagination] = await providersDal.getClients(providerId, page, limit);

  const hasClients = pagination.total > 0;

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {hasClients && (
          <div className="flex">
            <h1 className="text-2xl font-medium">Clients</h1>
            <Button asChild className="ml-auto">
              <Link href={`/u/providers/${providerId}/clients/new`}>Create new client</Link>
            </Button>
          </div>
        )}
        <div className="mt-10">
          {!hasClients && <NoClients providerId={providerId} />}
          {hasClients && <ClientsList clients={clients} providerId={providerId} pagination={pagination} />}
        </div>
      </div>
    </div>
  );
}
