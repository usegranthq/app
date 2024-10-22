import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Project } from '@/types/app.types';
import api from '@/lib/api';

import { ProjectSidebar } from './_blocks/ProjectSidebar';
import Topbar from '../../../_blocks/Topbar';
import { ProjectProvider } from './_blocks/ProjectContext';

interface UserLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

export default async function UserLayout(props: UserLayoutProps) {
  const { projectId } = await props.params;
  const { children } = props;

  const projects = await api.get<Project[]>('v1/u/projects').json();
  const activeProject = projects.find((project) => project.id === projectId);

  if (!activeProject) {
    return notFound();
  }

  return (
    <ProjectProvider project={activeProject}>
      <SidebarProvider>
        <ProjectSidebar projects={projects} activeProject={activeProject} />
        <SidebarInset>
          <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
            <Topbar>
              <div className="flex w-full items-center">
                <SidebarTrigger />
                <div className="ml-auto mr-4">
                  <Link href="/u/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    All Projects
                  </Link>
                </div>
              </div>
            </Topbar>
            <div className="p-2">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProjectProvider>
  );
}
