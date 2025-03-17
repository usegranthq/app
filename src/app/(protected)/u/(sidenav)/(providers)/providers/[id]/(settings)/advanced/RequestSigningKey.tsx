'use client';

import { startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Badge } from '@/shadcn/components/ui/badge';
import { Button } from '@/shadcn/components/ui/button';

import { PlanDetails } from '@/utils/billing';
import { requestSigningKey } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';
import { Provider } from '@/types';

interface RequestSigningKeyProps {
  provider: Provider;
  isLoading: boolean;
  plan: PlanDetails;
}

const RequestButton = (props: RequestSigningKeyProps) => {
  const { provider, isLoading, plan } = props;
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || isLoading || provider.rotateJwks || !plan.features.signingKeys.request}>
      Request new key
    </Button>
  );
};

export default function RequestSigningKey({ provider, isLoading, plan }: RequestSigningKeyProps) {
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
      <RequestButton provider={provider} isLoading={isLoading} plan={plan} />
      {!plan.features.signingKeys.request && (
        <div>
          <Badge variant="outline" className="">
            Upgrade to request new keys
          </Badge>
        </div>
      )}
    </form>
  );
}
