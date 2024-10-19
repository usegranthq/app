import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ProjectSwitcher projects={projects} activeProject={activeProject} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
