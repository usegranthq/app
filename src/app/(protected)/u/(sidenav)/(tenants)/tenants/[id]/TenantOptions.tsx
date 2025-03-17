'use client';

import { useTransition } from 'react';
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

import { deleteTenantProvider } from '@/actions';
import { useProgressBar } from '@/blocks/NavProgress';
import { TenantProvider } from '@/types/app.types';

interface TenantOptionsProps {
  tenantId: string;
  provider: TenantProvider;
}

export default function TenantOptions({ tenantId, provider }: TenantOptionsProps) {
  const router = useRouter();
  const progress = useProgressBar();
  const [isTransitioning, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      progress.start();

      const [error] = await deleteTenantProvider(tenantId, provider.id);
      if (error) {
        toast.error(error);
      }

      router.refresh();
    });
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure to delete this identity provider?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this will remove the identity provider from the tenant.
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
              <DropdownMenuItem className="text-destructive" disabled={isTransitioning}>
                {isTransitioning ? 'Deleting provider' : 'Delete provider'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}
