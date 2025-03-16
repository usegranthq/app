'use client';

import { ComponentProps, FC, startTransition, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { deleteTenant } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';
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
import { Tenant } from '@/types/app.types';

type DeleteButtonProps = ComponentProps<typeof Button>;

const DeleteButton: FC<DeleteButtonProps> = (props) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" {...props} disabled={pending}>
      {pending ? 'Deleting your tenant...' : 'Delete tenant'}
    </Button>
  );
};

interface DeleteTenantActionProps {
  tenant: Tenant;
}

export default function DeleteTenantAction(props: DeleteTenantActionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const progress = useProgressBar();

  const handleDeleteClick = async () => {
    startTransition(async () => {
      progress.start();

      const [error] = await deleteTenant(props.tenant.id);
      if (error) {
        toast.error(error);
      }
    });
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
                This action cannot be undone. This will permanently delete your tenant and all of its providers.
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
