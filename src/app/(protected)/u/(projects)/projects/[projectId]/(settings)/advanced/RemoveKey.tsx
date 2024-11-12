'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { removeKey } from '@/actions';

interface RemoveKeyProps {
  id: string;
  projectId: string;
}

const RemoveButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button variant="link" className="text-xs text-destructive" disabled={pending}>
      Remove
    </Button>
  );
};

export default function RemoveKey({ id, projectId }: RemoveKeyProps) {
  const handleRemove = async () => {
    const [errorMessage] = await removeKey(projectId, id);
    if (errorMessage) {
      toast.error(errorMessage);
    }
  };

  return (
    <form action={handleRemove}>
      <RemoveButton />
    </form>
  );
}
