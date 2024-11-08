import Link from 'next/link';
import { formatRelative } from 'date-fns';

import { Project } from '@/types/app.types';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import NoProjects from './NoProjects';
import { getProjects } from '@/dal/projects';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="relative flex h-44 flex-col hover:cursor-pointer hover:bg-muted/15">
      <CardHeader className="space-y-3">
        <CardTitle>{project.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{project.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-col items-start gap-0.5">
        <Link
          href={`https://usegrant.dev`}
          target="_blank"
          className="z-10 text-sm text-sky-400 underline-offset-2 hover:underline"
        >
          example.usegrant.dev
        </Link>
        <div className="text-xs text-muted-foreground">
          last updated {formatRelative(new Date(project.createdAt), new Date())}
        </div>
      </CardFooter>
      <Link href={`/u/projects/${project.id}`} className="absolute inset-0" />
    </Card>
  );
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return <NoProjects />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Projects</h1>
        <Button asChild>
          <Link href="/u/projects/new">Create new project</Link>
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
