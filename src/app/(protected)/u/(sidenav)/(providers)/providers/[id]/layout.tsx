import { notFound } from 'next/navigation';

import { getProviders } from '@/data/providers';

import SidenavLayout from '../../../_blocks/SidenavLayout';
import { ProviderProvider } from './_blocks/ProviderContext';
import ProviderNav from './_blocks/ProviderNav';
import ProviderSwitcher from './_blocks/ProviderSwitcher';

export default async function UserLayout(props: LayoutProps<'/u/providers/[id]'>) {
  const { id } = await props.params;
  const { children } = props;

  const providers = await getProviders();
  const activeProvider = providers.find((provider) => provider.id === id);

  if (!activeProvider) {
    return notFound();
  }

  return (
    <ProviderProvider provider={activeProvider}>
      <SidenavLayout
        header={<ProviderSwitcher providers={providers} activeProvider={activeProvider} />}
        content={<ProviderNav providerId={activeProvider.id} />}
      >
        {children}
      </SidenavLayout>
    </ProviderProvider>
  );
}
