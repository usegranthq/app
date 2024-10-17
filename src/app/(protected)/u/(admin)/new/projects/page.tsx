import { ContainerIcon } from 'lucide-react';

import CreateProjectForm from './CreateProjectForm';

export default function NewProjectPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <ContainerIcon className="size-8" />
        <h1 className="text-2xl font-medium">Create your project</h1>
        <p className="max-w-lg text-center text-sm text-muted-foreground">
          A project is like a isolated realm/provider where you can create multiple clients and get access to the API.
          Each project is like a seperated environment.
        </p>
        <CreateProjectForm />
      </div>
    </div>
  );
}
