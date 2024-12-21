import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

import { ProviderSidebar } from './_blocks/ProviderSidebar';
import Topbar from '../../../_blocks/Topbar';
import { ProviderProvider } from './_blocks/ProviderContext';
import { getProviders } from '@/data/providers';

interface UserLayoutProps {
  children: React.ReactNode;
  params: Promise<{ providerId: string }>;
}

export default async function UserLayout(props: UserLayoutProps) {
  const { providerId } = await props.params;
  const { children } = props;

  const providers = await getProviders();
  const activeProvider = providers.find((provider) => provider.id === providerId);

  if (!activeProvider) {
    return notFound();
  }

  return (
    <ProviderProvider provider={activeProvider}>
      <SidebarProvider>
        <ProviderSidebar providers={providers} activeProvider={activeProvider} />
        <SidebarInset>
          <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
            <Topbar>
              <div className="flex w-full items-center">
                <SidebarTrigger />
                <div className="ml-auto mr-4">
                  <Link href="/u/providers" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    All Providers
                  </Link>
                </div>
              </div>
            </Topbar>
            <div className="p-2">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProviderProvider>
  );
}
