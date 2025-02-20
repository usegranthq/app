'use client';

import { FC, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { deleteSessions } from '@/actions';
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
import { Button, ButtonProps } from '@/components/ui/button';

const DeleteButton: FC<ButtonProps> = (props) => {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending}>
      {pending ? 'Deleting your sessions...' : 'Delete all sessions'}
    </Button>
  );
};

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
