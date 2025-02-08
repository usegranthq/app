import Link from 'next/link';
import { formatRelative } from 'date-fns';

import { getTenants } from '@/data/tenants';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tenant } from '@/types/app.types';

import NoTenants from './NoTenants';

const TenantCard = ({ tenant }: { tenant: Tenant }) => {
  return (
    <Card className="relative flex h-44 flex-col border-l-4 border-l-primary hover:cursor-pointer hover:bg-muted/15">
      <CardHeader className="space-y-3">
        <CardTitle>{tenant.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{tenant.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-col items-start gap-0.5">
        <div className="text-xs text-muted-foreground">
          last updated {formatRelative(new Date(tenant.updatedAt), new Date())}
        </div>
      </CardFooter>
      <Link href={`/u/tenants/${tenant.id}`} className="absolute inset-0" />
    </Card>
  );
};

export default async function TenantsPage() {
  const tenants = await getTenants();

  if (tenants.length === 0) {
    return <NoTenants />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Tenants</h1>
        <Button asChild>
          <Link href="/u/tenants/new">Create new tenant</Link>
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </div>
    </>
  );
}
