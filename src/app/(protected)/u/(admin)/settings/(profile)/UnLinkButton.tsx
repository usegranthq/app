'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shadcn/components/ui/alert-dialog';
import { Button } from '@/shadcn/components/ui/button';

import { authClient } from '@/lib/auth-client';
import { useProgressBar } from '@/components/NavProgress';

interface LinkButtonProps {
  provider: {
    provider: string;
    label: string;
  };
}

export default function UnLinkButton({ provider }: LinkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();

  const handleUnlink = () => {
    startTransition(async () => {
      progress.start();

      await authClient.unlinkAccount({
        providerId: provider.provider,
        fetchOptions: {
          onError: ({ error }) => {
            if (typeof error === 'object' && 'message' in error) {
              toast.error('Failed to unlink account: ' + error.message);
            }
          },
        },
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={isPending}>
          Unlink
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unlink {provider.label} Account</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to unlink your {provider.label} account. Are you sure you want to proceed? This action cannot
            be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlink}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
