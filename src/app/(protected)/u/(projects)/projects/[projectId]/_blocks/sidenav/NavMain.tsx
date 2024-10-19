import Link from 'next/link';
import { BookOpenIcon, ChevronRight, Code2Icon, Settings2Icon, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

interface SubItem {
  title: string;
  path: string;
}

interface NavItem {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: SubItem[];
  defaultOpen?: boolean;
}

const items: NavItem[] = [
  {
    title: 'Documentation',
    icon: BookOpenIcon,
    items: [
      {
        title: 'Get Started',
        path: '#',
      },
      {
        title: 'Assume role from AWS',
        path: '#',
      },
      {
        title: 'Service Accounts in GCP',
        path: '#',
      },
      {
        title: 'Assume role from Azure',
        path: '#',
      },
      {
        title: 'More...',
        path: '#',
      },
    ],
  },
  {
    title: 'API',
    icon: Code2Icon,
    defaultOpen: true,
    items: [
      // {
      //   title: 'Create Project',
      //   url: '#',
      // },
      {
        title: 'Create Client',
        path: '#',
      },
      {
        title: 'Get Access Token',
        path: '#',
      },
    ],
  },
  {
    title: 'Settings',
    icon: Settings2Icon,
    defaultOpen: true,
    items: [
      {
        title: 'General',
        path: 'general',
      },
      {
        title: 'Domain',
        path: 'domain',
      },
      {
        title: 'Advanced',
        path: 'advanced',
      },
    ],
  },
];

export function NavMain({ projectId }: { projectId: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Project</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.defaultOpen} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/u/projects/${projectId}/${subItem.path}`}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
