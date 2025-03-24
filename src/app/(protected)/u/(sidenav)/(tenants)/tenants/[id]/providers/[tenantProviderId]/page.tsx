import { notFound } from 'next/navigation';

import { normalizePaginationParams } from '@/utils/pagination';
import { getTenant, getTenantProvider, getTenantProviderPolicies } from '@/data/tenants';

import NoPolicies from './NoPolicies';
import TenantProviderPolicies from './TenantProviderPolicies';

interface TenantPageProps {
  params: Params<{ id: string; tenantProviderId: string }>;
  searchParams: SearchParams<PaginationProps>;
}

export default async function TenantPage({ params, searchParams }: TenantPageProps) {
  const { id, tenantProviderId } = await params;
  const queryParams = await searchParams;

  const tenant = await getTenant(id);
  if (!tenant) {
    return notFound();
  }

  const tenantProvider = await getTenantProvider(tenant.id, tenantProviderId);
  if (!tenantProvider) {
    return notFound();
  }

  const { page, limit } = normalizePaginationParams(queryParams);
  const [policies, pagination] = await getTenantProviderPolicies(tenant.id, tenantProviderId, page, limit);

  if (pagination.total === 0) {
    return <NoPolicies id={tenant.id} tenantProviderId={tenantProvider.id} />;
  }

  return (
    <TenantProviderPolicies
      tenantProvider={tenantProvider}
      policies={policies}
      id={tenant.id}
      pagination={pagination}
    />
  );
}
