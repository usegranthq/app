'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { type SigningKey } from '@/data/providers';
import { PlanDetails } from '@/utils/billing';
import { formatDate } from '@/utils/date';
import { toggleRotateJwks } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Provider } from '@/types';

import RemoveKey from './RemoveKey';
import RequestSigningKey from './RequestSigningKey';

interface KeysListProps {
  provider: Provider;
  signingKeys: SigningKey[];
  plan: PlanDetails;
}

const updateProvider = (provider: Provider, update: Partial<Provider>) => {
  return { ...provider, ...update };
};

export default function KeysList({ signingKeys, provider, plan }: KeysListProps) {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();
  const [optimisticProvider, setOptimisticProvider] = useOptimistic(provider, updateProvider);

  const handleRotateJwks = (checked: boolean) => {
    startTransition(async () => {
      progress.start();
      setOptimisticProvider({ rotateJwks: checked });

      const [error] = await toggleRotateJwks(provider.id, checked);
      if (error) {
        toast.error(error);
      }
    });
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="rotate-jwks"
          checked={optimisticProvider.rotateJwks}
          onCheckedChange={handleRotateJwks}
          disabled={isPending || !plan.signingKeys.autoRotate}
          title={plan.signingKeys.autoRotate ? 'Automatically rotate keys' : 'Upgrade to rotate keys automatically'}
        />
        <Label htmlFor="rotate-jwks">Automatically rotate keys</Label>
        {!plan.signingKeys.autoRotate && (
          <div>
            <Badge variant="outline" className="">
              Upgrade to rotate keys automatically
            </Badge>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        When automatic rotation is enabled, a new key is generated daily. The most recent old key is retained in the
        database for compatibility with existing tokens, while all other keys are removed. This process repeats.
      </p>
      <p className="mb-2 mt-10">The following keys are available:</p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        {signingKeys.map((key, index) => {
          const isFirst = index === 0;
          const canRemoveKey = !isFirst && !key.isDefault && !optimisticProvider.rotateJwks && !isPending;

          return (
            <li key={key.kid} className="list-item">
              <div className="ml-2 flex items-center gap-3">
                <span className="py-0.5 font-mono text-sm font-medium">{key.kid}</span>
                {key.isDefault && (
                  <Badge variant="outline" className="w-16 rounded-sm py-0">
                    Default
                  </Badge>
                )}
                {isFirst && <Badge className="w-16 rounded-sm py-0">Current</Badge>}
                {canRemoveKey && <RemoveKey id={key.id} providerId={provider.id} />}
                {key.createdAt && (
                  <span className="text-xs text-muted-foreground">issued at: {formatDate(key.createdAt)}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-8">
        <p className="mb-4 text-sm text-muted-foreground">
          You can request a new key to rotate the signing keys. The newly generated key will be used for signing the
          tokens.
        </p>
        <RequestSigningKey provider={optimisticProvider} isLoading={isPending} plan={plan} />
      </div>
    </>
  );
}
