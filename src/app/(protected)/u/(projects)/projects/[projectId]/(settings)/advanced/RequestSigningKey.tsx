'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { requestSigningKey } from '@/actions';
import { Button } from '@/components/ui/button';

interface RequestSigningKeyProps {
  projectId: string;
}

const RequestButton = () => {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Request new key</Button>;
};

export default function RequestSigningKey({ projectId }: RequestSigningKeyProps) {
  const handleSubmit = async () => {
    const [errorMessage] = await requestSigningKey(projectId);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    toast.success('New key generated');
  };

  return (
    <form action={handleSubmit}>
      <RequestButton />
    </form>
  );
}
