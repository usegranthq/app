'use client';

import { ComponentProps, FC, useRef, useState } from 'react';
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
} from '@/shadcn/components/ui/alert-dialog';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';

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
  const [confirm, setConfirm] = useState('');

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
            <div className="my-2 grid gap-2">
              <Label>Type &quot;DELETE&quot; to confirm</Label>
              <Input
                placeholder="DELETE"
                className="font-mono tracking-widest placeholder:font-bold"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={confirm.toLowerCase() !== 'delete'}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
}
