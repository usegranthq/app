import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { Provider } from '@/types/app.types';

import { NavMain } from './sidenav/NavMain';
import { NavSecondary } from './sidenav/NavSecondary';
import { NavUser } from './sidenav/NavUser';
import { ProviderSwitcher } from './sidenav/ProviderSwitcher';

interface ProviderSidebarProps {
  providers: Provider[];
  activeProvider: Provider;
}

export async function ProviderSidebar({ providers, activeProvider }: ProviderSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ProviderSwitcher providers={providers} activeProvider={activeProvider} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain providerId={activeProvider.id} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
