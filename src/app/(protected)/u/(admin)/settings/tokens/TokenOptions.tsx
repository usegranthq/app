'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { deleteToken } from '@/actions/settings';
import { Token } from '@/types/app.types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function TokenOptions({ token }: { token: Token }) {
  const handleDelete = async () => {
    const error = await deleteToken(token.id);
    if (error) {
      toast.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure to delete this token?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this token and cannot be undone. Think twice before deleting it.
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
            <DropdownMenuItem className="text-destructive">Delete token</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
