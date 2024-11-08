'use client';

import { ComponentPropsWithoutRef } from 'react';
import { BadgeCheckIcon, LockIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useUser } from '@/contexts/User';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

import { UserAvatar } from './UserAvatar';

type UserNavDropdownProps = ComponentPropsWithoutRef<typeof DropdownMenuContent>;

export default function UserNavDropdown(props: UserNavDropdownProps) {
  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/login');
    } catch {
      toast.error('Failed to logout. Try again.');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <DropdownMenuContent {...props} className={cn(props.className, 'w-56')}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
            <UserAvatar className="rounded-md border" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">hey there 👋</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/u/settings">
              <BadgeCheckIcon className="text-muted-foreground" />
              Account
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/u/settings/billing">
              <CreditCardIcon className="text-muted-foreground" />
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/u/settings/security">
              <LockIcon className="text-muted-foreground" />
              Security
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialogTrigger asChild>
          <DropdownMenuItem>
            <LogOutIcon className="text-muted-foreground" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </AlertDialog>
  );
}
