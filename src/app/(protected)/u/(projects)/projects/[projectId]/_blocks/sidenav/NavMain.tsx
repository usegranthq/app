'use client';

import Link from 'next/link';
import { BookOpenIcon, ChevronRight, Code2Icon, Settings2Icon, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: Pick<NavItem, 'title' | 'url'>[];
  defaultOpen?: boolean;
}

const items: NavItem[] = [
  {
    title: 'Documentation',
    url: '#',
    icon: BookOpenIcon,
    items: [
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
      {
        title: 'More...',
        url: '#',
      },
    ],
  },
  {
    title: 'API',
    url: '#',
    icon: Code2Icon,
    defaultOpen: true,
    items: [
      // {
      //   title: 'Create Project',
      //   url: '#',
      // },
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
    defaultOpen: true,
    items: [
      {
        title: 'General',
        url: '#',
      },
      {
        title: 'Custom Domains',
        url: '#',
      },
      {
        title: 'Advanced',
        url: '#',
      },
    ],
  },
];

export function NavMain({ className }: { className?: string }) {
  return (
    <ul className={cn('grid gap-0.5', className)}>
      {items.map((item) => (
        <Collapsible key={item.title} asChild defaultOpen={item.defaultOpen}>
          <li>
            <div className="relative flex items-center">
              <Link
                href={item.url}
                className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <div className="flex flex-1 overflow-hidden">
                  <div className="line-clamp-1 pr-6">{item.title}</div>
                </div>
              </Link>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute right-1 h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 data-[state=open]:rotate-90"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="px-4 py-0.5">
              <ul className="grid border-l px-2">
                {item.items?.map((subItem) => (
                  <li key={subItem.title}>
                    <Link
                      href={subItem.url}
                      className="flex h-8 min-w-8 items-center gap-2 overflow-hidden rounded-md px-2 text-sm font-medium text-muted-foreground ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
                    >
                      <div className="line-clamp-1">{subItem.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </li>
        </Collapsible>
      ))}
    </ul>
  );
}
