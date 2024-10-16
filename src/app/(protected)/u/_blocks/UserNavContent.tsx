'use client';

import { BadgeCheckIcon, LockIcon, CreditCardIcon } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';

import { useUser } from '@/contexts/User';

import { UserAvatar } from './UserAvatar';
import { LogoutDropItem } from './LogoutDropItem';

export default function UserNavContent() {
  const user = useUser();

  return (
    <>
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
      <LogoutDropItem />
    </>
  );
}
