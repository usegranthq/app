import { notFound } from 'next/navigation';

import { getProject } from '@/data/projects';

import SigningKeys from './SigningKeys';

interface AdvancedPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const getDomain = (urlId: string, path: string) => {
  const domain = `https://${process.env.PROJECT_DOMAIN}`.replace('{urlId}', urlId);
  return new URL(path, domain).toString();
};

export default async function AdvancedPage({ params }: AdvancedPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  const domain = getDomain(project.urlId, '/.well-known/jwks');

  return (
    <div className="flex flex-col gap-8">
      <SigningKeys projectId={projectId} domain={domain} />
    </div>
  );
}
