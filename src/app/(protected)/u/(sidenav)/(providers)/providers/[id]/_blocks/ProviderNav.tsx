import Link from 'next/link';
import { BookOpenIcon, ChevronRight, Code2Icon, Settings2Icon, UsersIcon, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shadcn/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shadcn/components/ui/sidebar';

interface SubItem {
  title: string;
  path: string;
  external?: boolean;
}

interface NavItem {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: SubItem[];
  defaultOpen?: boolean;
  path?: string;
}

interface NavGroup {
  type: 'group';
  label: string;
  items: NavItem[];
}

const items: NavGroup[] = [
  {
    type: 'group',
    label: 'Provider',
    items: [
      {
        title: 'Clients',
        icon: UsersIcon,
        path: '',
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
    ],
  },
  {
    type: 'group',
    label: 'Documentation',
    items: [
      {
        title: 'Guides',
        icon: BookOpenIcon,
        items: [
          {
            title: 'Get Started',
            path: '/docs',
            external: true,
          },
          {
            title: 'Assume role from AWS',
            path: '/docs/guides/aws',
            external: true,
          },
          {
            title: 'Service Accounts in GCP',
            path: '/docs/guides/gcp',
            external: true,
          },
          {
            title: 'Assume role from Azure',
            path: '/docs/guides/azure',
            external: true,
          },
          {
            title: 'More...',
            path: '/docs/guides',
            external: true,
          },
        ],
      },
      {
        title: 'API',
        icon: Code2Icon,
        defaultOpen: true,
        items: [
          // {
          //   title: 'Create Provider',
          //   url: '#',
          // },
          {
            title: 'Create Client',
            path: '/docs/api/clients/create-client',
            external: true,
          },
          {
            title: 'Get Access Token',
            path: '/docs/api/access-tokens/create-token',
            external: true,
          },
        ],
      },
    ],
  },
];

const getPath = (path: string, providerId: string): string => {
  return path.startsWith('/') ? path : `/u/providers/${providerId}/${path}`;
};

export default function ProviderNav({ providerId }: { providerId: string }) {
  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              if (typeof item.path === 'string') {
                const path = getPath(item.path, providerId);

                return (
                  <SidebarMenuButton tooltip={item.title} asChild key={item.title}>
                    <Link href={path}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                );
              }

              return (
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
                        {item.items?.map((subItem) => {
                          const path = getPath(subItem.path, providerId);
                          const LinkComponent = subItem.external ? 'a' : Link;
                          const target = subItem.external ? '_blank' : undefined;

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <LinkComponent href={path} target={target}>
                                  <span>{subItem.title}</span>
                                </LinkComponent>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
