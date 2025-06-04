import Link from 'next/link';

import { SidebarTrigger } from '@/shadcn/components/ui/sidebar';

import Topbar from '../../_blocks/Topbar';

export function TopNav() {
  return (
    <Topbar>
      <div className="flex w-full items-center">
        <SidebarTrigger />
        <div className="ml-auto mr-4 flex gap-6">
          <Link href="/u/providers" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Providers
          </Link>
          <Link href="/u/tenants" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Tenants
          </Link>
          <a href="/docs" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Docs
          </a>
        </div>
      </div>
    </Topbar>
  );
}
