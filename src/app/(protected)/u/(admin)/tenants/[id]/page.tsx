import { notFound } from 'next/navigation';

import { getTenant, getTenantProviders } from '@/data/tenants';
import NoIdp from './NoIdp';
import TenantProviders from './TenantProviders';

type TenantPageProps = Params<{ id: string }>;

export default async function TenantPage({ params }: TenantPageProps) {
  const { id } = await params;
  const tenant = await getTenant(id);

  if (!tenant) {
    return notFound();
  }

  const providers = await getTenantProviders(tenant.id);
  if (providers.length === 0) {
    return <NoIdp id={tenant.id} />;
  }

  return <TenantProviders providers={providers} id={tenant.id} />;
}
