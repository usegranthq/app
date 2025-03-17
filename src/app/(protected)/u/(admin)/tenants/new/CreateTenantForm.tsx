'use client';

import { startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { Textarea } from '@/shadcn/components/ui/textarea';

import { createTenant } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';

function CreateTenantButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Create tenant</Button>;
}

export default function CreateTenantForm() {
  const router = useRouter();
  const progress = useProgressBar();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      progress.start();
      const [error, tenant] = await createTenant(formData);

      if (error || !tenant) {
        toast.error(error);
        return;
      }

      toast.success(`Tenant ${tenant.name} created successfully`);
      router.push(`/u/tenants/${tenant.id}`);
    });
  };

  return (
    <form className="mt-10 flex w-full max-w-lg flex-col items-center gap-8" action={handleSubmit}>
      <div className="grid w-full gap-2">
        <Label>Name</Label>
        <Input name="name" placeholder="Tenant name" required minLength={3} maxLength={32} />
      </div>
      <div className="grid w-full gap-2">
        <Label>Description</Label>
        <Textarea name="description" placeholder="Tenant description" required minLength={3} maxLength={100} rows={3} />
      </div>
      <div>
        <CreateTenantButton />
      </div>
    </form>
  );
}
