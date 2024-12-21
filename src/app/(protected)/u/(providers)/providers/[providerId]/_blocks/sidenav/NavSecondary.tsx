'use client';

import Link from 'next/link';
import { LifeBuoyIcon, SendIcon } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Support',
    url: 'mailto:support@usegrant.dev',
    icon: LifeBuoyIcon,
  },
  {
    title: 'Feedback',
    url: 'mailto:support@usegrant.dev',
    icon: SendIcon,
  },
];

type NavSecondaryProps = ComponentPropsWithoutRef<typeof SidebarGroup>;

export function NavSecondary(props: NavSecondaryProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
