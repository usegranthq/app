import RecentProjectTracker from './RecentProjectTracker';

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
