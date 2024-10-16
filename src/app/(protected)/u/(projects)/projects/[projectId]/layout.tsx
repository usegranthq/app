import { cookies } from 'next/headers';

import { SIDEBAR_STATE_COOKIE, SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar';

import { AppSidebar } from './_blocks/AppSidebar';
import Topbar from '../../../_blocks/Topbar';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = cookies().get(SIDEBAR_STATE_COOKIE)?.value !== 'false';

  return (
    <SidebarLayout defaultOpen={defaultOpen} className="bg-background">
      <AppSidebar />
      <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
        <Topbar>
          <SidebarTrigger />
        </Topbar>
        <div className="p-2">{children}</div>
      </main>
    </SidebarLayout>
  );
}
