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

export default function UnLinkButton({ provider }: LinkButtonProps) {
  const handleUnlink = () => {
    authClient.unlinkAccount({
      providerId: provider.provider,
      fetchOptions: {
        onError: ({ error }) => {
          if (typeof error === 'object' && 'message' in error) {
            toast.error('Failed to unlink account: ' + error.message);
          }
        },
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
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
