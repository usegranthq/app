'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
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

import { cancelSubscription } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';

export default function CancelPlanButton() {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();
  const router = useRouter();

  const handleCancel = async () => {
    startTransition(async () => {
      progress.start();
      const [errorMessage] = await cancelSubscription();
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      router.refresh();

      toast.success('Subscription cancelled successfully');
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-32 opacity-70 hover:opacity-100" disabled={isPending}>
          Downgrade
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel your subscription immediately and your will lose access to all paid features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="button" onClick={handleCancel}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
