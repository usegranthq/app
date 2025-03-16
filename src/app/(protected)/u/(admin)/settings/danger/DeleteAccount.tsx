'use client';

import { ComponentProps, FC, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { deleteAccount } from '@/actions/settings';
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
import { Button } from '@/components/ui/button';

type DeleteButtonProps = ComponentProps<typeof Button>;

const DeleteButton: FC<DeleteButtonProps> = (props) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" {...props} disabled={pending}>
      {pending ? 'Deleting your account...' : 'Delete account'}
    </Button>
  );
};

DeleteButton.displayName = 'DeleteButton';

export default function DeleteAccount() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleDeleteClick = async () => {
    const [error] = await deleteAccount();
    if (error) {
      toast.error(error);
    }
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
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
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
