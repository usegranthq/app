import { notFound } from 'next/navigation';
import { KeySquareIcon } from 'lucide-react';

import { getTenantProvider } from '@/data/tenants';

import AddPolicyForm from './AddPolicyForm';

export default async function AddIdp({ params }: PageProps<'/u/tenants/[id]/providers/[tenantProviderId]/add'>) {
  const { id, tenantProviderId } = await params;

  const tenantProvider = await getTenantProvider(id, tenantProviderId);

  if (!tenantProvider) {
    return notFound();
  }

  return (
    <div className="mx-auto mt-10 flex w-full max-w-xl flex-1 items-center justify-center">
      <div className="flex w-full flex-col items-center gap-2">
        <KeySquareIcon className="size-8" />
        <h1 className="text-2xl font-medium">Add policy</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A policy is a set of conditions that are used to validate your authorization requests.
        </p>
        <AddPolicyForm tenantId={id} tenantProvider={tenantProvider} />
      </div>
    </div>
  );
}
