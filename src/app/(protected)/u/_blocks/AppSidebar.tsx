import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from '@/components/ui/sidebar';
import { User } from '@/types/app.types';

import { NavMain } from './nav/NavMain';
import { NavSecondary } from './nav/NavSecondary';
import { NavUser } from './nav/NavUser';
import { ProjectSwitcher } from './nav/ProjectSwitcher';

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar defaultChecked={true}>
      <SidebarHeader className="h-12">
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Project</SidebarLabel>
          <NavMain />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
