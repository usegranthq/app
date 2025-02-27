import { ContainerIcon } from 'lucide-react';

import CreateProviderForm from './CreateProviderForm';

export default function NewProviderPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <ContainerIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your provider</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A provider is an isolated entity where you can create multiple clients. Generate access tokens for your
          clients to access your services.
        </p>
        <CreateProviderForm />
      </div>
    </div>
  );
}
