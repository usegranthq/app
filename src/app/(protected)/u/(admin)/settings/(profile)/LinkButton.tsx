'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { useProgressBar } from '@/components/NavProgress';
import ROUTES from '@/constants/routes';
import { authClient } from '@/lib/auth-client';
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

interface LinkButtonProps {
  provider: {
    provider: string;
    label: string;
  };
}

export default function LinkButton({ provider }: LinkButtonProps) {
  const [isPending, startTransition] = useTransition();

  const progress = useProgressBar();
  const handleLink = () => {
    startTransition(async () => {
      progress.start();

      await authClient.linkSocial({
        provider: provider.provider,
        callbackURL: ROUTES.SETTINGS,
        fetchOptions: {
          onError: ({ error }) => {
            if (typeof error === 'object' && 'message' in error) {
              toast.error('Failed to link account: ' + error.message);
            }
          },
        },
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={isPending}>
          Link
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Link {provider.label} Account</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to link your {provider.label} account. You will be now redirected to {provider.label} to
            authorize the connection.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLink}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
