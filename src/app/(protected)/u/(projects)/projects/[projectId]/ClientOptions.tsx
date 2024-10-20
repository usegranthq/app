'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { deleteClient, generateClientToken } from '@/actions';
import { Client } from '@/types/app.types';

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
import { useState } from 'react';

export default function ClientOptions({ projectId, client }: { projectId: string; client: Client }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleGenerateToken = async () => {
    const toastId = toast('GenerateToken');
    toast.loading('Generating Token...', { id: toastId });

    const [error, token] = await generateClientToken(projectId, client.id);
    if (error) {
      toast.error(error, { id: toastId });
      return;
    }

    setAccessToken(token);
    toast.dismiss(toastId);
  };

  const handleDelete = async () => {
    const [error] = await deleteClient(projectId, client.id);
    if (error) {
      toast.error(error);
    }

    router.refresh();
  };

  return (
    <>
      <AlertDialog open={!!accessToken} onOpenChange={() => setAccessToken(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access token</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="rounded-md bg-muted p-2">
            <p className="break-all font-mono text-xs">{accessToken}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure to delete this client?</AlertDialogTitle>
            <AlertDialogDescription>Deleting this will remove the client from the project.</AlertDialogDescription>
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
            <DropdownMenuItem onClick={handleGenerateToken}>Generate token</DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive">Delete client</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}
