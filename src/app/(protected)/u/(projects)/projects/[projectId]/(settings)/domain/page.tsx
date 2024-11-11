import { notFound } from 'next/navigation';

import { getDomains, getProject } from '@/data/projects';

import CADetails from './CaDetails';
import DomainDetails from './DomainDetails';
import CustomDomains from './Domains';

interface DomainPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function DomainPage(props: DomainPageProps) {
  const { projectId } = await props.params;
  const projectPromise = getProject(projectId);
  const domainsPromise = getDomains(projectId);

  const [project, domains] = await Promise.all([projectPromise, domainsPromise]);

  if (!project) {
    return notFound();
  }

  const defaultDomain = `${process.env.PROJECT_DOMAIN}`.replace('{urlId}', project.urlId);

  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">Manage domain</h1>
      <div className="flex flex-col gap-8">
        <DomainDetails project={project} defaultDomain={defaultDomain} domains={domains} />
        <CustomDomains project={project} domains={domains} />
        <CADetails project={project} defaultDomain={defaultDomain} domains={domains} />
      </div>
    </div>
  );
}
