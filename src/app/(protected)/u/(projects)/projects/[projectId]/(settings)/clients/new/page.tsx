import { UserRoundPlusIcon } from 'lucide-react';

import CreateClientForm from './CreateClientForm';

interface NewClientPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function NewClientPage(props: NewClientPageProps) {
  const { projectId } = await props.params;

  return (
    <div className="mt-10 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <UserRoundPlusIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create a client</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A client is a user that can access the API, you can create multiple clients for a project. The client will be
          configured with your targer oidc provider.
        </p>
        <CreateClientForm projectId={projectId} />
      </div>
    </div>
  );
}
