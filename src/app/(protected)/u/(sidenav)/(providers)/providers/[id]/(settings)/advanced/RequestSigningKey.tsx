'use client';

import { startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { requestSigningKey } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';
import { Button } from '@/shadcn/components/ui/button';
import { Provider } from '@/types';

interface RequestSigningKeyProps {
  provider: Provider;
  isLoading: boolean;
}

const RequestButton = (props: RequestSigningKeyProps) => {
  const { provider, isLoading } = props;
  const { pending } = useFormStatus();

  return <Button disabled={pending || isLoading || provider.rotateJwks}>Request new key</Button>;
};

export default function RequestSigningKey({ provider, isLoading }: RequestSigningKeyProps) {
  const progress = useProgressBar();

  const handleSubmit = async () => {
    startTransition(async () => {
      progress.start();

      const [errorMessage] = await requestSigningKey(provider.id);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success('New key generated');
    });
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <RequestButton provider={provider} isLoading={isLoading} />
    </form>
  );
}
