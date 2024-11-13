import { notFound } from 'next/navigation';

import { getProject } from '@/data/projects';

import SigningKeys from './SigningKeys';
import { getDefaultDomain } from '@/app/project-helpers';

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

  const domain = getDefaultDomain(project.urlId, '/.well-known/jwks');

  return (
    <div className="flex flex-col gap-8">
      <SigningKeys projectId={projectId} domain={domain} />
    </div>
  );
}
