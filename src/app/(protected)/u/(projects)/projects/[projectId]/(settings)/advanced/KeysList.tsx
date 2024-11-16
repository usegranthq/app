'use client';

import { formatDate } from 'date-fns';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { type SigningKey } from '@/data/projects';
import { Project } from '@/types';
import { toggleRotateJwks } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import RemoveKey from './RemoveKey';
import RequestSigningKey from './RequestSigningKey';

interface KeysListProps {
  project: Project;
  signingKeys: SigningKey[];
}

export default function KeysList({ signingKeys, project }: KeysListProps) {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();
  const [optimisticProject, setOptimisticProject] = useOptimistic(project, (draft, update: Partial<Project>) => {
    return { ...draft, ...update };
  });

  const handleRotateJwks = (checked: boolean) => {
    startTransition(async () => {
      progress.start();
      setOptimisticProject({ rotateJwks: checked });

      const [error] = await toggleRotateJwks(project.id, checked);
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
          checked={optimisticProject.rotateJwks}
          onCheckedChange={handleRotateJwks}
          disabled={isPending}
        />
        <Label htmlFor="rotate-jwks">Automatically rotate JWKS</Label>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        When automatic rotation is enabled, a new key is generated daily. The most recent old key is retained in the
        database for compatibility with existing tokens, while all other keys are removed. This process repeats.
      </p>
      <p className="mb-2 mt-10">The following keys are available:</p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        {signingKeys.map((key, index) => {
          const isFirst = index === 0;
          const canRemoveKey = !isFirst && !key.isDefault && !optimisticProject.rotateJwks && !isPending;

          return (
            <li key={key.kid} className="list-item">
              <div className="ml-2 flex items-center gap-3">
                <span className="py-0.5 font-mono text-sm font-medium">{key.kid}</span>
                {key.isDefault && <Badge variant="outline">Default</Badge>}
                {isFirst && <Badge>Current</Badge>}
                {canRemoveKey && <RemoveKey id={key.id} projectId={project.id} />}
                {key.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    issued at: {formatDate(key.createdAt, 'MMM d, yyyy')}
                  </span>
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
        <RequestSigningKey project={optimisticProject} isLoading={isPending} />
      </div>
    </>
  );
}
