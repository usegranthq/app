'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { deleteClient, generateAccessToken } from '@/actions';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useToggle } from '@/hooks/use-toggle';
import { Client } from '@/types/app.types';

export default function ClientOptions({ providerId, client }: { providerId: string; client: Client }) {
  const router = useRouter();
  const progress = useProgressBar();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isTransitioning, startTransition] = useTransition();

  const [useJwtType, toggleUseJwtType] = useToggle(false);
  const [audienceAsArray, toggleAudienceAsArray] = useToggle(false);

  const handleGenerateToken = async () => {
    const generateAccessTokenOptions = {
      useJwtType,
      audienceAsArray,
    };

    startTransition(async () => {
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

  useEffect(() => {
    if (!accessToken) return;
    handleGenerateToken();
  }, [audienceAsArray, useJwtType, accessToken, handleGenerateToken]);

  const handleDelete = async () => {
    startTransition(async () => {
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
            <AlertDialogDescription>Deleting this will remove the client from the provider.</AlertDialogDescription>
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
