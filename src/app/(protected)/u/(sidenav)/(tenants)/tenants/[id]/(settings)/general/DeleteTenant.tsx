import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { Tenant } from '@/types/app.types';

import DeleteTenantAction from './DeleteTenantAction';

interface DeleteTenantProps {
  tenant: Tenant;
}

export default function DeleteTenant(props: DeleteTenantProps) {
  const { tenant } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Tenant</CardTitle>
        <CardDescription>Permanently remove your tenant and all your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This will permanently delete your tenant and all of its providers. This action is not reversible, so please
          continue with caution.
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <DeleteTenantAction tenant={tenant} />
      </CardFooter>
    </Card>
  );
}
