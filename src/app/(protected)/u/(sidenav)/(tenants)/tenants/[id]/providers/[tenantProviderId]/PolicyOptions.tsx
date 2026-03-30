'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { deleteTenantProviderPolicy } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { TenantProviderPolicy } from '@/types/app.types';

interface PolicyOptionsProps {
  tenantId: string;
  tenantProviderId: string;
  policy: TenantProviderPolicy;
}

export default function PolicyOptions({ tenantId, tenantProviderId, policy }: PolicyOptionsProps) {
  const router = useRouter();
  const progress = useProgressBar();
  const [isTransitioning, startTransition] = useTransition();
  const [showConditions, setShowConditions] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      progress.start();

      const [error] = await deleteTenantProviderPolicy(tenantId, tenantProviderId, policy.id);
      if (error) {
        toast.error(error);
      }

      router.refresh();
    });
  };

  return (
    <>
      <Dialog open={showConditions} onOpenChange={setShowConditions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{policy.name}</DialogTitle>
            <DialogDescription>Conditions set for this policy are:</DialogDescription>
          </DialogHeader>
          <div className="mt-2 text-sm">
            <pre className="rounded-md bg-muted p-2">
              <code>{JSON.stringify(policy.conditions, null, 2)}</code>
            </pre>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure you want to delete this policy?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete policy <span className="font-bold">{policy.name}</span>. Deleting this will
              permanently remove the policy from the tenant provider.
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
            <DropdownMenuItem onClick={() => setShowConditions(true)}>View conditions</DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive" disabled={isTransitioning}>
                {isTransitioning ? 'Deleting policy' : 'Delete policy'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}
