import { notFound } from 'next/navigation';

import { FeatureUnavailable } from '@/blocks/FeatureUnavailable';

import { getDomains, getProject } from '@/data/projects';
import { getPlanDetails } from '@/data/user';
import { getDefaultDomain, getDefaultDomainHostname } from '@/app/project-helpers';

import CaDetails from './CaDetails';
import DomainDetails from './DomainDetails';
import CustomDomains from './Domains';

interface DomainPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function DomainPage(props: DomainPageProps) {
  const { projectId } = await props.params;
  const projectPromise = getProject(projectId);
  const domainsPromise = getDomains(projectId);
  const plan = await getPlanDetails();

  const [project, domains] = await Promise.all([projectPromise, domainsPromise]);

  if (!project) {
    return notFound();
  }

  const defaultDomain = getDefaultDomain(project.urlId);
  const defaultDomainHostname = getDefaultDomainHostname(project.urlId);

  const isCustomDomainAvailable = plan.customDomain.available;

  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">Manage domain</h1>
      <div className="flex flex-col gap-8">
        <FeatureUnavailable available={isCustomDomainAvailable} name="Custom domain">
          {domains.length === 0 && <DomainDetails project={project} defaultDomain={defaultDomain} domains={domains} />}
          <CustomDomains project={project} domains={domains} />
        </FeatureUnavailable>
        <CaDetails project={project} defaultDomain={defaultDomainHostname} domains={domains} />
      </div>
    </div>
  );
}
