'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import { startTransition } from 'react';

import { Button } from '@/components/ui/button';
import { removeKey } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';

interface RemoveKeyProps {
  id: string;
  projectId: string;
}

const RemoveButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button variant="link" className="h-0 text-xs text-destructive" disabled={pending}>
      Remove
    </Button>
  );
};

export default function RemoveKey({ id, projectId }: RemoveKeyProps) {
  const progress = useProgressBar();

  const handleRemove = async () => {
    startTransition(async () => {
      progress.start();

      const [errorMessage] = await removeKey(projectId, id);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success('Key removed successfully');
    });
  };

  return (
    <form action={handleRemove}>
      <RemoveButton />
    </form>
  );
}
