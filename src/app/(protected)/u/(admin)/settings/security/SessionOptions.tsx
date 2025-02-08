'use client';

import { useRouter } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { deleteSession } from '@/actions/settings';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Session } from '@/types/app.types';

export default function SessionOptions({ session }: { session: Session }) {
  const router = useRouter();
  const handleDelete = async () => {
    const [error] = await deleteSession(session.token);
    if (error) {
      toast.error(error);
    }
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure to delete this session?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this will log you out of the device that this session is currently active on.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="mr-4 size-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">Delete session</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
