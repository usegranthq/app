import { BadgeCheckIcon, LockIcon, ChevronsUpDownIcon, CreditCardIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/app.types';

import { LogoutDropItem } from './LogoutDropItem';
import { UserAvatar } from './UserAvatar';

interface NavUserProps {
  user: User;
}

export const NavUserContent = ({ user }: NavUserProps) => {
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
          <UserAvatar user={user} className="rounded-md border" />
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
        <DropdownMenuItem className="gap-2">
          <BadgeCheckIcon className="text-muted-foreground" />
          Account
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
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
};

export function NavUser({ user }: NavUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md outline-none ring-ring hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
          <UserAvatar user={user} className="rounded-md border" />
          <div className="grid flex-1 leading-none">
            {/* <div className="font-medium">{user.name}</div> */}
            <div className="overflow-hidden text-sm text-muted-foreground">
              <div className="line-clamp-1">{user.email}</div>
            </div>
          </div>
          <ChevronsUpDownIcon className="ml-auto mr-0.5 size-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={4}>
        <NavUserContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
