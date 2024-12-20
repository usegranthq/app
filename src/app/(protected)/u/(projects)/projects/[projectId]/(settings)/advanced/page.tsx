import { notFound } from 'next/navigation';

import { getProject } from '@/data/projects';
import { getDefaultDomain } from '@/app/project-helpers';
import { getPlanDetails } from '@/data/user';

import SigningKeys from './SigningKeys';

interface AdvancedPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function AdvancedPage({ params }: AdvancedPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  const plan = await getPlanDetails();
  const jwksUrl = getDefaultDomain(project.urlId, '/.well-known/jwks');

  return (
    <div className="flex flex-col gap-8">
      <SigningKeys project={project} jwksUrl={jwksUrl} canRotateSigningKey={plan.rotateSigningKey} />
    </div>
  );
}
