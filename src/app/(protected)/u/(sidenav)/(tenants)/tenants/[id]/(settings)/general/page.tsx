import { notFound } from 'next/navigation';

import { getTenant } from '@/data/tenants';

import DeleteTenant from './DeleteTenant';
import TenantDetails from './TenantDetails';

export default async function GeneralPage(props: PageProps<'/u/tenants/[id]/general'>) {
  const { id } = await props.params;

  const tenant = await getTenant(id);

  if (!tenant) {
    return notFound();
  }

  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">General</h1>
      <div className="flex flex-col gap-8">
        <TenantDetails tenant={tenant} />
        <DeleteTenant tenant={tenant} />
      </div>
    </div>
  );
}
