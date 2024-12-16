'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { deleteClient, generateAccessToken } from '@/actions';
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
import { useProgressBar } from '@/blocks/NavProgress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const useToggle = (initialValue: boolean): [boolean, () => void] => {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = () => setValue(!value);
  return [value, toggle];
};

export default function ClientOptions({ projectId, client }: { projectId: string; client: Client }) {
  const router = useRouter();
  const progress = useProgressBar();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isTransitioning, startTransition] = useTransition();

  const [jwtType, toggleJwtType] = useToggle(false);
  const [audienceAsArray, toggleAudienceAsArray] = useToggle(false);

  const handleGenerateToken = async () => {
    startTransition(async () => {
      const toastId = toast('GenerateToken');
      toast.loading('Generating Token...', { id: toastId });

      progress.start();

      const [error, token] = await generateAccessToken(projectId, client.id, { jwtType, audienceAsArray });
      if (error) {
        toast.error(error, { id: toastId });
        return;
      }

      setAccessToken(token);
      toast.dismiss(toastId);
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      progress.start();

      const [error] = await deleteClient(projectId, client.id);
      if (error) {
        toast.error(error);
      }

      router.refresh();
    });
  };

  return (
    <>
      <AlertDialog open={!!accessToken} onOpenChange={() => setAccessToken(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access token</AlertDialogTitle>
            <AlertDialogDescription>
              Generated access token for the client. This token is not stored. If you lose it, you will have to generate
              a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-md bg-muted p-2">
            <div
              className="break-all font-mono text-xs"
              onClick={(e) => {
                const range = document.createRange();
                range.selectNodeContents(e.target as HTMLDivElement);
                const sel = window.getSelection();
                if (!sel) return;
                sel.removeAllRanges();
                sel.addRange(range);
              }}
            >
              {accessToken}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="jwtType"
                checked={jwtType}
                onCheckedChange={() => {
                  toggleJwtType();
                  handleGenerateToken();
                }}
              />
              <Label htmlFor="jwtType">JWT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="audienceAsArray"
                checked={audienceAsArray}
                onCheckedChange={() => {
                  toggleAudienceAsArray();
                  handleGenerateToken();
                }}
              />
              <Label htmlFor="audienceAsArray">Audience as array</Label>
            </div>
          </div>
          <div>
            <Link
              target="_blank"
              href={`https://jwt.io/?value=${accessToken}`}
              className="text-sm underline underline-offset-2"
            >
              Open in jwt.io
            </Link>
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
              <DropdownMenuItem className="text-destructive" disabled={isTransitioning}>
                {isTransitioning ? 'Deleting client' : 'Delete client'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}
