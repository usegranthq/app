'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { toggleRotateJwks } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';
import { type SigningKey } from '@/data/providers';
import { Badge } from '@/shadcn/components/ui/badge';
import { Label } from '@/shadcn/components/ui/label';
import { Switch } from '@/shadcn/components/ui/switch';
import { Provider } from '@/types';
import { formatDate } from '@/utils/date';

import RemoveKey from './RemoveKey';
import RequestSigningKey from './RequestSigningKey';

interface KeysListProps {
  provider: Provider;
  signingKeys: SigningKey[];
}

const updateProvider = (provider: Provider, update: Partial<Provider>) => {
  return { ...provider, ...update };
};

export default function KeysList({ signingKeys, provider }: KeysListProps) {
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
          disabled={isPending}
          title="Automatically rotate keys"
        />
        <Label htmlFor="rotate-jwks">Automatically rotate keys</Label>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        When automatic rotation is enabled, a new key is generated daily. Old keys stay published for as long as tokens
        signed with them can still be valid, then they are removed.
      </p>
      <p className="mt-10 mb-2">The following keys are available:</p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        {signingKeys.map((key, index) => {
          const isFirst = index === 0;
          const canRemoveKey = !isFirst && !optimisticProvider.rotateJwks && !isPending;

          return (
            <li key={key.kid} className="list-item">
              <div className="ml-2 flex items-center gap-3">
                <span className="py-0.5 font-mono text-sm font-medium">{key.kid}</span>
                {isFirst && <Badge className="w-16 rounded-sm py-0">Current</Badge>}
                {canRemoveKey && <RemoveKey id={key.id} providerId={provider.id} />}
                <span className="text-xs text-muted-foreground">issued at: {formatDate(key.createdAt)}</span>
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
        <RequestSigningKey provider={optimisticProvider} isLoading={isPending} />
      </div>
    </>
  );
}
