import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from '@/components/ui/sidebar';

import { NavMain } from './sidenav/NavMain';
import { NavSecondary } from './sidenav/NavSecondary';
import { NavUser } from './sidenav/NavUser';
import { ProjectSwitcher } from './sidenav/ProjectSwitcher';

export function AppSidebar() {
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
