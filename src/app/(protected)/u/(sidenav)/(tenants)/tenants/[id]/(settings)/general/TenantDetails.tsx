'use client';

import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { updateTenant } from '@/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tenant } from '@/types/app.types';

const SaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Save
    </Button>
  );
};

interface TenantDetailsProps {
  tenant: Tenant;
}

export default function TenantDetails(props: TenantDetailsProps) {
  const router = useRouter();
  const { tenant } = props;

  const handleSubmit = async (formData: FormData) => {
    const [error] = await updateTenant(tenant.id, formData);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Tenant details updated');
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant details</CardTitle>
        <CardDescription>Manage your tenant settings.</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label>Tenant name</Label>
              <Input
                name="name"
                defaultValue={tenant.name}
                required
                minLength={3}
                maxLength={32}
                placeholder="Tenant name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tenant description</Label>
              <Textarea
                rows={3}
                name="description"
                defaultValue={tenant.description}
                required
                minLength={3}
                maxLength={100}
                placeholder="Tenant description"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <SaveButton />
        </CardFooter>
      </form>
    </Card>
  );
}
