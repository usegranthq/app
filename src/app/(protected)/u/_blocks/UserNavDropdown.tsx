'use client';

import { ComponentPropsWithoutRef } from 'react';
import { BadgeCheckIcon, LockIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
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
} from '@/components/ui/alert-dialog';

import { useUser } from '@/contexts/User';
import { cn } from '@/lib/utils';

import { UserAvatar } from './UserAvatar';
import { useToggle } from 'usehooks-ts';
import { logout } from '@/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type UserNavDropdownProps = ComponentPropsWithoutRef<typeof DropdownMenuContent>;

export default function UserNavDropdown(props: UserNavDropdownProps) {
  const user = useUser();
  const router = useRouter();
  const [isLogoutDialogOpen, , setIsLogoutDialogOpen] = useToggle(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <>
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsLogoutDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenuContent {...props} className={cn(props.className, 'w-56')}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
            <UserAvatar className="rounded-md border" />
            <div className="grid flex-1">
              <div className="font-medium">hey there 👋</div>
              <div className="overflow-hidden text-xs text-muted-foreground">
                <div className="line-clamp-1">{user.email}</div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2" asChild>
            <Link href="/u/settings">
              <BadgeCheckIcon className="text-muted-foreground" />
              Account
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <CreditCardIcon className="text-muted-foreground" />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <LockIcon className="text-muted-foreground" />
            Security
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onClick={() => setIsLogoutDialogOpen(true)}>
          <LogOutIcon className="text-muted-foreground" />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
