import { cookies } from 'next/headers';

import { SIDEBAR_STATE_COOKIE, SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar';
import { Project } from '@/types/app.types';
import api from '@/lib/api';

import { ProjectSidebar } from './_blocks/ProjectSidebar';
import Topbar from '../../../_blocks/Topbar';
import { notFound } from 'next/navigation';

interface UserLayoutProps {
  children: React.ReactNode;
  params: { projectId: string };
}

export default async function UserLayout({ children, params }: UserLayoutProps) {
  const defaultOpen = cookies().get(SIDEBAR_STATE_COOKIE)?.value !== 'false';

  const projects = await api.get<Project[]>('v1/u/projects').json();
  const activeProject = projects.find((project) => project.id === params.projectId);

  if (!activeProject) {
    return notFound();
  }

  return (
    <SidebarLayout defaultOpen={defaultOpen} className="bg-background">
      <ProjectSidebar projects={projects} activeProject={activeProject} />
      <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
        <Topbar>
          <SidebarTrigger />
        </Topbar>
        <div className="p-2">{children}</div>
      </main>
    </SidebarLayout>
  );
}
