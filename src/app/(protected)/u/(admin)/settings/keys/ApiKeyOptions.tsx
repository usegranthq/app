'use client';

import { startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';

import { deleteApiKey } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';
import { ApiKey } from '@/types/app.types';

export default function ApiKeyOptions({ apiKey }: { apiKey: ApiKey }) {
  const router = useRouter();
  const progress = useProgressBar();

  const handleDelete = async () => {
    startTransition(async () => {
      progress.start();
      const [error] = await deleteApiKey(apiKey.id);
      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Api key deleted successfully');
      router.refresh();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure to delete this api key?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this api key and cannot be undone. Think twice before deleting it.
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
            <DropdownMenuItem className="text-destructive">Delete key</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
