'use client';

import { ChevronsUpDownIcon } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/User';

import { UserAvatar } from '@/app/(protected)/u/_blocks/UserAvatar';
import UserNavDropdown from '@/app/(protected)/u/_blocks/UserNavDropdown';

export function NavUser() {
  const user = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md outline-none ring-ring hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
          <UserAvatar className="rounded-md border" />
          <div className="grid flex-1 leading-none">
            {/* <div className="font-medium">{user.name}</div> */}
            <div className="overflow-hidden text-sm text-muted-foreground">
              <div className="line-clamp-1">{user.email}</div>
            </div>
          </div>
          <ChevronsUpDownIcon className="ml-auto mr-0.5 size-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <UserNavDropdown side="right" sideOffset={4} />
    </DropdownMenu>
  );
}
