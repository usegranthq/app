import { notFound } from 'next/navigation';

import { getTenant, getTenants } from '@/data/tenants';

import SidenavLayout from '../../../_blocks/SidenavLayout';
import { TenantNav } from './_blocks/TenantNav';
import { TenantSwitcher } from './_blocks/TenantSwitcher';

export default async function TenantLayout(props: LayoutProps<'/u/tenants/[id]'>) {
  const { id } = await props.params;
  const { children } = props;

  const tenants = await getTenants();
  const activeTenant = await getTenant(id);

  if (!activeTenant) {
    return notFound();
  }

  return (
    <SidenavLayout
      header={<TenantSwitcher tenants={tenants} activeTenant={activeTenant} />}
      content={<TenantNav tenantId={id} />}
    >
      {children}
    </SidenavLayout>
  );
}
