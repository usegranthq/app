'use client';

import {
  BookOpenIcon,
  Code2Icon,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from '@/components/ui/sidebar';
import { User } from '@/types/app.types';

import { NavMain } from './NavMain';
import { NavSecondary } from './NavSecondary';
import { NavUser } from './NavUser';
import { ProjectSwitcher } from './ProjectSwitcher';

const data = {
  navMain: [
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpenIcon,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Assume role from AWS',
          url: '#',
        },
        {
          title: 'Service Accounts in GCP',
          url: '#',
        },
        {
          title: 'Assume role from Azure',
          url: '#',
        },
      ],
    },
    {
      title: 'API',
      url: '#',
      icon: Code2Icon,
      items: [
        {
          title: 'Create Project',
          url: '#',
        },
        {
          title: 'Create Client',
          url: '#',
        },
        {
          title: 'Get Access Token',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2Icon,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
        {
          title: 'Advanced',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: 'mailto:support@usegrant.dev',
      icon: LifeBuoyIcon,
    },
    {
      title: 'Feedback',
      url: 'mailto:feedback@usegrant.dev',
      icon: SendIcon,
    },
  ],
  projects: [
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
  ],
};

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar defaultChecked={true}>
      <SidebarHeader className="h-12">
        <ProjectSwitcher projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Platform</SidebarLabel>
          <NavMain items={data.navMain} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
