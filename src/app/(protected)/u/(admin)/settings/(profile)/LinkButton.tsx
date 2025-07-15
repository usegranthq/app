'use client';

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

import ROUTES from '@/constants/routes';
import { authClient } from '@/lib/auth-client';

interface LinkButtonProps {
  provider: {
    provider: string;
    label: string;
  };
}

export default function LinkButton({ provider }: LinkButtonProps) {
  const handleLink = () => {
    authClient.linkSocial({
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
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm">Link</Button>
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
