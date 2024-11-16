'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { startTransition } from 'react';

import { requestSigningKey } from '@/actions';
import { Button } from '@/components/ui/button';
import { useProgressBar } from '@/blocks/NavProgress';
import { Project } from '@/types';

interface RequestSigningKeyProps {
  project: Project;
  isLoading: boolean;
}

const RequestButton = (props: RequestSigningKeyProps) => {
  const { project, isLoading } = props;
  const { pending } = useFormStatus();

  return <Button disabled={pending || isLoading || project.rotateJwks}>Request new key</Button>;
};

export default function RequestSigningKey({ project, isLoading }: RequestSigningKeyProps) {
  const progress = useProgressBar();

  const handleSubmit = async () => {
    startTransition(async () => {
      progress.start();

      const [errorMessage] = await requestSigningKey(project.id);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success('New key generated');
    });
  };

  return (
    <form action={handleSubmit}>
      <RequestButton project={project} isLoading={isLoading} />
    </form>
  );
}
