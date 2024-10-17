import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { RECENT_PROJECT_COOKIE } from '@/constants';
import api from '@/lib/api';
import { Project } from '@/types/app.types';

export default async function UPage() {
  const recentProjectId = cookies().get(RECENT_PROJECT_COOKIE)?.value;
  const projects = await api.get<Project[]>('v1/u/projects').json();
  const recentProject = projects.find((project) => project.id === recentProjectId);

  if (recentProject) {
    redirect(`/u/projects/${recentProject.id}`);
  }

  redirect('/u/projects');
}
