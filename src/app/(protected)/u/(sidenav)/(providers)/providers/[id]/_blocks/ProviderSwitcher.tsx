'use client';

import Link from 'next/link';
import { ChevronsUpDownIcon, KanbanIcon, PlusIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Provider } from '@/types/app.types';

interface ProviderSwitcherProps {
  providers: Provider[];
  activeProvider: Provider;
}

export default function ProviderSwitcher({ providers, activeProvider }: ProviderSwitcherProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <KanbanIcon className="size-4 shrink-0" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeProvider.name}</span>
                <span className="truncate text-xs">{activeProvider.description}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Providers</DropdownMenuLabel>
            {providers.map((provider, index) => (
              <DropdownMenuItem key={provider.id} className="gap-2 p-2" asChild>
                <Link href={`/u/providers/${provider.id}`}>
                  <div className="grid flex-1 leading-tight">
                    <div className="line-clamp-1 font-medium">{provider.name}</div>
                    <div className="overflow-hidden text-xs text-muted-foreground">
                      <div className="line-clamp-1">{provider.description}</div>
                    </div>
                  </div>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/u/providers/new">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add provider</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
