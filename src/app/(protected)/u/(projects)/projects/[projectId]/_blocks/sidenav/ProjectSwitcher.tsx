import { ChevronsUpDownIcon, KanbanIcon, PlusIcon } from 'lucide-react';

import { Project } from '@/types/app.types';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface ProjectSwitcherProps {
  projects: Project[];
  activeProject: Project;
}

export async function ProjectSwitcher({ projects, activeProject }: ProjectSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <KanbanIcon className="size-3.5 shrink-0" />
          </div>
          <div className="line-clamp-1 flex-1 pr-2 font-medium">{activeProject.name}</div>
          <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" side="right" sideOffset={4}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Projects</DropdownMenuLabel>
        {projects.map((project, index) => (
          <DropdownMenuItem key={project.name} className="items-start gap-2 px-1.5" asChild>
            <Link href={`/u/projects/${project.id}`}>
              <div className="grid flex-1 leading-tight">
                <div className="line-clamp-1 font-medium">{project.name}</div>
                <div className="overflow-hidden text-xs text-muted-foreground">
                  <div className="line-clamp-1">{project.description}</div>
                </div>
              </div>
              <DropdownMenuShortcut className="self-center">⌘{index + 1}</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 px-1.5" asChild>
          <Link href="/u/new/projects">
            <div className="flex size-8 items-center justify-center rounded-md border bg-background">
              <PlusIcon className="size-5" />
            </div>
            <div className="font-medium text-muted-foreground">Add project</div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
