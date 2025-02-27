'use client';

import { ComponentPropsWithoutRef } from 'react';
import { LifeBuoyIcon, SendIcon } from 'lucide-react';

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
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
