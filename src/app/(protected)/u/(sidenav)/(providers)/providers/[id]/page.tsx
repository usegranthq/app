import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shadcn/components/ui/breadcrumb';
import { Button } from '@/shadcn/components/ui/button';

import ROUTES from '@/constants/routes';
import { normalizePaginationParams } from '@/utils/pagination';
import * as providersDal from '@/data/providers';

import ClientsList from './ClientsList';
import NoClients from './NoClients';

interface ProviderPageProps {
  params: Params<{ id: string }>;
  searchParams: SearchParams<PaginationProps>;
}

export default async function ProviderPage(props: ProviderPageProps) {
  const { id } = await props.params;
  const queryParams = await props.searchParams;

  const provider = await providersDal.getProvider(id);
  if (!provider) {
    return notFound();
  }

  const { page, limit } = normalizePaginationParams(queryParams);
  const [clients, pagination] = await providersDal.getClients(id, page, limit);

  const hasClients = pagination.total > 0;

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {hasClients && (
          <div className="flex">
            <div className="grid gap-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={ROUTES.PROVIDERS}>Providers</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Clients</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-medium">{provider.name}</h1>
            </div>
            <Button asChild className="ml-auto">
              <Link href={`/u/providers/${id}/clients/new`}>Create new client</Link>
            </Button>
          </div>
        )}
        <div className="mt-10">
          {!hasClients && <NoClients id={id} />}
          {hasClients && <ClientsList clients={clients} id={id} pagination={pagination} />}
        </div>
      </div>
    </div>
  );
}
