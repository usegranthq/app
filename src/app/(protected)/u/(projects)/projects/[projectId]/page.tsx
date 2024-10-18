import RecentProjectTracker from './_blocks/RecentProjectTracker';

interface ProjectPageProps {
  params: { projectId: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div>
      <RecentProjectTracker projectId={params.projectId} />
      Project page
    </div>
  );
}
