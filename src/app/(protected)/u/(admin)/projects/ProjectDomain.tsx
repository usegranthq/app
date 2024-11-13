import Link from 'next/link';

import { Project } from '@/types/app.types';
import { getDomains } from '@/data/projects';
import { getProjectDomain, getWellKnownOpenIdUrl } from '@/app/project-helpers';

interface ProjectDomainProps {
  project: Project;
}

export default async function ProjectDomain({ project }: ProjectDomainProps) {
  const domains = await getDomains(project.id);
  const domain = getProjectDomain(project, domains);

  return (
    <Link
      href={getWellKnownOpenIdUrl(domain)}
      target="_blank"
      className="z-10 text-sm text-sky-400 underline-offset-2 hover:underline"
    >
      {domain}
    </Link>
  );
}
