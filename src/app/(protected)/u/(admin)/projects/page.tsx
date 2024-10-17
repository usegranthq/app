import api from '@/lib/api';
import Link from 'next/link';

import { Project } from '@/types/app.types';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import NoProjects from './NoProjects';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link href={`/u/projects/${project.id}`}>
      <Card className="flex h-44 flex-col hover:cursor-pointer hover:bg-muted/15">
        <CardHeader className="space-y-3">
          <CardTitle>{project.name}</CardTitle>
          <CardDescription className="text-sm">{project.description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto justify-end">
          <div className="text-sm text-muted-foreground">customdomain.usegrant.dev</div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default async function ProjectsPage() {
  const projects = await api.get<Project[]>('v1/u/projects').json();

  if (projects.length === 0) {
    return <NoProjects />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Projects</h1>
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
