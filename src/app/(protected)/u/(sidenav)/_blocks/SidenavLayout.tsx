import { PropsWithChildren } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/shadcn/components/ui/sidebar';

import { NavSecondary } from './NavSecondary';
import { NavUser } from './NavUser';
import { TopNav } from './TopNav';

interface SidenavLayoutProps extends PropsWithChildren {
  header?: React.ReactNode;
  content?: React.ReactNode;
}

export default function SidenavLayout(props: SidenavLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>{props.header}</SidebarHeader>
        <SidebarContent>
          {props.content}
          <NavSecondary className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <TopNav />
          <div className="p-2">{props.children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
