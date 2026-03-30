import { notFound } from 'next/navigation';

import { getTenant, getTenantProviders } from '@/data/tenants';
import { normalizePaginationParams } from '@/utils/pagination';

import NoIdp from './NoIdp';
import TenantProviders from './TenantProviders';

interface TenantPageProps {
  params: Params<{ id: string }>;
  searchParams: SearchParams<PaginationProps>;
}

export default async function TenantPage({ params, searchParams }: TenantPageProps) {
  const { id } = await params;
  const queryParams = await searchParams;

  const tenant = await getTenant(id);
  if (!tenant) {
    return notFound();
  }

  const { page, limit } = normalizePaginationParams(queryParams);
  const [providers, pagination] = await getTenantProviders(tenant.id, page, limit);

  if (pagination.total === 0) {
    return <NoIdp id={tenant.id} />;
  }

  return <TenantProviders providers={providers} id={tenant.id} pagination={pagination} tenant={tenant} />;
}
