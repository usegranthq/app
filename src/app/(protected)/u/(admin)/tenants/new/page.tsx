import { ContainerIcon } from 'lucide-react';

import CreateTenantForm from './CreateTenantForm';

export default function NewTenantPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 items-center justify-center">
      <div className="flex w-full flex-col items-center gap-2">
        <ContainerIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your tenant</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A tenant is a group of identity providers. Use the api&apos;s to validate the token against the configured
          providers.
        </p>
        <CreateTenantForm />
      </div>
    </div>
  );
}
