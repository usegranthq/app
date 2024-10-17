import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SIDEBAR_STATE_COOKIE, SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar';
import { Project } from '@/types/app.types';
import api from '@/lib/api';

import { ProjectSidebar } from './_blocks/ProjectSidebar';
import Topbar from '../../../_blocks/Topbar';

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
      </main>
    </SidebarLayout>
  );
}
