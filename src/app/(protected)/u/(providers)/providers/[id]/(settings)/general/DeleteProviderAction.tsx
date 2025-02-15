'use client';

import { forwardRef, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { deleteProvider } from '@/actions';
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

import { useProviderContext } from '../../_blocks/ProviderContext';

const DeleteButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" ref={ref} {...props} disabled={pending}>
      {pending ? 'Deleting your provider...' : 'Delete provider'}
    </Button>
  );
});

DeleteButton.displayName = 'DeleteButton';

export default function DeleteProviderAction() {
  const formRef = useRef<HTMLFormElement>(null);
  const { provider } = useProviderContext();

  const handleDeleteClick = async () => {
    const [error] = await deleteProvider(provider.id);
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
                This action cannot be undone. This will permanently delete your provider and all of its clients.
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
