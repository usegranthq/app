import { SidebarTrigger } from '@/components/ui/sidebar';
import { User } from '@/types/app.types';

import { TapNav } from './nav/TopNav';
import { ThemeSwitcher } from './ThemeSwitcher';

interface TopbarProps {
  user: User;
}

export default function Topbar({ user }: TopbarProps) {
  return (
    <div className="flex h-12 items-center border-b px-4">
      <div>
        <SidebarTrigger />
      </div>
      <div className="ml-auto flex items-center space-x-2.5">
        <ThemeSwitcher />
        <TapNav user={user} />
      </div>
    </div>
  );
}
