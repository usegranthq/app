'use client';

import { toast } from 'sonner';
import { forwardRef, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { Button, ButtonProps } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { deleteSessions } from '@/actions';

const DeleteButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" ref={ref} {...props} disabled={pending}>
      {pending ? 'Deleting your sessions...' : 'Delete all sessions'}
    </Button>
  );
});

DeleteButton.displayName = 'DeleteButton';

export default function DeleteSessions() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleDeleteClick = async () => {
    const [error] = await deleteSessions();

    if (error) {
      toast.error(error);
    }

    router.refresh();
  };

  return (
    <div>
      <form ref={formRef} action={handleDeleteClick}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DeleteButton />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your sessions and remove your data from
                our servers. This will not delete your current session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="button" onClick={() => formRef.current?.requestSubmit()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
}
