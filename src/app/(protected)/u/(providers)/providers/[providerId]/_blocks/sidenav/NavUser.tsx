'use client';

import { ChevronsUpDownIcon } from 'lucide-react';

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/User';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { UserAvatar } from '@/app/(protected)/u/_blocks/UserAvatar';
import UserNavDropdown from '@/app/(protected)/u/_blocks/UserNavDropdown';

export function NavUser() {
  const user = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full rounded-md outline-none ring-ring hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent"
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
