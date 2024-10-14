import { cookies } from 'next/headers';

import { SIDEBAR_STATE_COOKIE, SidebarLayout } from '@/components/ui/sidebar';
import { User } from '@/types/app.types';
import api from '@/lib/api';
import { minimumDelay } from '@/utils/time';

import SWR from './_blocks/SWR';
import { AppSidebar } from './_blocks/AppSidebar';
import Topbar from './_blocks/Topbar';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const initialTime = Date.now();
  const user = await api.get<User>('v1/u/me').json();

  const currentTime = Date.now();
  await minimumDelay(2_000, initialTime, currentTime);

  const defaultOpen = cookies().get(SIDEBAR_STATE_COOKIE)?.value !== 'false';

  return (
    <SWR>
      <SidebarLayout defaultOpen={defaultOpen} className="bg-background">
        <AppSidebar user={user} />
        <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <Topbar user={user} />
          <div className="p-2">{children}</div>
        </main>
      </SidebarLayout>
    </SWR>
  );
}
