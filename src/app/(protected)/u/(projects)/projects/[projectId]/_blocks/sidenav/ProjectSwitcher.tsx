'use client';

import { useState } from 'react';
import { ChevronsUpDown, FrameIcon, LucideIcon, MapIcon, PieChartIcon, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  name: string;
  icon: LucideIcon;
  description: string;
}

const projects: Project[] = [
  {
    name: 'Design Engineering',
    description: 'This project focuses on the design and engineering aspects of our platform.',
    icon: FrameIcon,
  },
  {
    name: 'Sales & Marketing',
    description: 'Sales and marketing aspects of our platform.',
    icon: PieChartIcon,
  },
  {
    name: 'Travel',
    description: 'Travel aspects of our platform.',
    icon: MapIcon,
  },
];

export function ProjectSwitcher() {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <activeProject.icon className="h-3.5 w-3.5 shrink-0" />
          </div>
          <div className="line-clamp-1 flex-1 pr-2 font-medium">{activeProject.name}</div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" side="right" sideOffset={4}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Projects</DropdownMenuLabel>
        {projects.map((project, index) => (
          <DropdownMenuItem
            key={project.name}
            onClick={() => setActiveProject(project)}
            className="items-start gap-2 px-1.5"
          >
            <div className="grid flex-1 leading-tight">
              <div className="line-clamp-1 font-medium">{project.name}</div>
              <div className="overflow-hidden text-xs text-muted-foreground">
                <div className="line-clamp-1">{project.description}</div>
              </div>
            </div>
            <DropdownMenuShortcut className="self-center">⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 px-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background">
            <Plus className="h-5 w-5" />
          </div>
          <div className="font-medium text-muted-foreground">Add project</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
