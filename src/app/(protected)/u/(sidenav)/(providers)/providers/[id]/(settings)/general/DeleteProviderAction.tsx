'use client';

import { ComponentProps, FC, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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

import { deleteProvider } from '@/actions';

import { useProviderContext } from '../../_blocks/ProviderContext';

type DeleteButtonProps = ComponentProps<typeof Button>;

const DeleteButton: FC<DeleteButtonProps> = (props) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" {...props} disabled={pending}>
      {pending ? 'Deleting your provider...' : 'Delete provider'}
    </Button>
  );
};

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
