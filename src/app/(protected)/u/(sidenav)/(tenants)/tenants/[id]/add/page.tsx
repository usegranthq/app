import { KeySquareIcon } from 'lucide-react';

import AddProviderForm from './AddProviderForm';

export default async function AddIdp({ params }: PageProps<'/u/tenants/[id]/add'>) {
  const { id } = await params;

  return (
    <div className="mx-auto mt-10 flex w-full max-w-xl flex-1 items-center justify-center">
      <div className="flex w-full flex-col items-center gap-2">
        <KeySquareIcon className="size-8" />
        <h1 className="text-2xl font-medium">Add identity provider</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          An identity provider is a service that validates your authorization requests.
        </p>
        <AddProviderForm tenantId={id} />
      </div>
    </div>
  );
}
