import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from '@/components/ui/sidebar';
import { Project } from '@/types/app.types';

import { NavMain } from './sidenav/NavMain';
import { NavSecondary } from './sidenav/NavSecondary';
import { NavUser } from './sidenav/NavUser';
import { ProjectSwitcher } from './sidenav/ProjectSwitcher';

interface ProjectSidebarProps {
  projects: Project[];
  activeProject: Project;
}

export async function ProjectSidebar({ projects, activeProject }: ProjectSidebarProps) {
  return (
    <Sidebar defaultChecked={true}>
      <SidebarHeader className="h-14">
        <ProjectSwitcher projects={projects} activeProject={activeProject} />
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
