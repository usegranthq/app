'use client';

import { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheckIcon, CreditCardIcon, LockIcon, LogOutIcon } from 'lucide-react';
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
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/shadcn/components/ui/dropdown-menu';
import { cn } from '@/shadcn/lib/utils';

import { authClient } from '@/lib/auth-client';
import { useUser } from '@/contexts/User';

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
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to sign out of your account. You will need to log in again to access your data and settings.
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
