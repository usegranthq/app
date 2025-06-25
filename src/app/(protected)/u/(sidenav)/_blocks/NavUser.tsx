'use client';

import { ChevronsUpDownIcon } from 'lucide-react';

import { DropdownMenu, DropdownMenuTrigger } from '@/shadcn/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shadcn/components/ui/sidebar';

import { UserAvatar } from '@/app/(protected)/u/_blocks/UserAvatar';
import UserNavDropdown from '@/app/(protected)/u/_blocks/UserNavDropdown';
import { useUser } from '@/contexts/User';

export function NavUser() {
  const user = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full rounded-md ring-ring outline-hidden hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent"
            asChild
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* <span className="truncate font-semibold">{user.name}</span> */}
                <span className="truncate text-sm">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserNavDropdown side="right" sideOffset={4} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
