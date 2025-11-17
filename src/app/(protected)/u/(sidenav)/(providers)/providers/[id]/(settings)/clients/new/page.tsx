import { UserRoundPlusIcon } from 'lucide-react';

import CreateClientForm from './CreateClientForm';

export default async function NewClientPage(props: PageProps<'/u/providers/[id]/clients/new'>) {
  const { id } = await props.params;

  return (
    <div className="mt-10 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <UserRoundPlusIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create a client</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A client is an entity that can access the API. The client will be configured with your target oidc provider to
          establish trust-based access.
        </p>
        <CreateClientForm id={id} />
      </div>
    </div>
  );
}
