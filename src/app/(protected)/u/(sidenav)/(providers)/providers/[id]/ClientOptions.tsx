'use client';

import { MouseEvent, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useToggle } from 'usehooks-ts';

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
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { Label } from '@/shadcn/components/ui/label';

import { Client } from '@/types/app.types';

import { deleteClient, generateAccessToken } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';

export default function ClientOptions({ providerId, client }: { providerId: string; client: Client }) {
  const router = useRouter();
  const progress = useProgressBar();
  const [accessToken, setAccessToken] = useState<string | null>('');
  const [isGeneratingToken, startGeneratingToken] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const [useJwtType, toggleUseJwtType] = useToggle(false);
  const [audienceAsArray, toggleAudienceAsArray] = useToggle(false);

  const generateToken = async (e: MouseEvent) => {
    e.preventDefault();

    const generateAccessTokenOptions = {
      useJwtType,
      audienceAsArray,
    };

    startGeneratingToken(async () => {
      const toastId = toast('GenerateToken');
      toast.loading('Generating Token...', { id: toastId });

      progress.start();

      const [error, token] = await generateAccessToken(providerId, client.id, generateAccessTokenOptions);
      if (error) {
        toast.error(error, { id: toastId });
        return;
      }

      setAccessToken(token);
      toast.dismiss(toastId);
    });
  };

  const handleDelete = async () => {
    startDeleting(async () => {
      progress.start();

      const [error] = await deleteClient(providerId, client.id);
      if (error) {
        toast.error(error);
      }

      router.refresh();
    });
  };

  return (
    <>
      <AlertDialog open={!!accessToken} onOpenChange={() => setAccessToken('')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access token</AlertDialogTitle>
            <AlertDialogDescription>
              Generated access token for the client. This token is not stored. If you lose it, you will have to generate
              a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="h-52 overflow-hidden rounded-md bg-muted">
            <textarea
              className="h-full w-full resize-none rounded-md p-2 font-mono text-xs break-all"
              readOnly
              value={accessToken ?? ''}
              onClick={(e) => {
                (e.target as HTMLTextAreaElement).select();
              }}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="useJwtType" checked={useJwtType} onCheckedChange={toggleUseJwtType} />
              <Label htmlFor="useJwtType" className="text-sm">
                SimpleJWT
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="audienceAsArray" checked={audienceAsArray} onCheckedChange={toggleAudienceAsArray} />
              <Label htmlFor="audienceAsArray" className="text-sm">
                Audience as array
              </Label>
            </div>
          </div>
          <div>
            <Link
              target="_blank"
              href={`https://jwt.io#token=${accessToken}`}
              className="text-sm underline underline-offset-2"
            >
              Open in jwt.io
            </Link>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction disabled={isGeneratingToken} onClick={generateToken}>
              {isGeneratingToken ? 'Generating token...' : 'Regenerate token'}
            </AlertDialogAction>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure to delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Deleting this will permanently remove the client from the provider.
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
            <DropdownMenuItem onClick={generateToken} disabled={isGeneratingToken}>
              {isGeneratingToken ? 'Generating token...' : 'Generate token'}
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive" disabled={isDeleting}>
                {isDeleting ? 'Deleting client...' : 'Delete client'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}
