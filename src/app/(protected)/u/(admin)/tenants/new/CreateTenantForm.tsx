'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/shadcn/components/ui/button';

import { createTenant } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { tenantSchema } from '@/schema';

type TenantFormValues = z.infer<typeof tenantSchema>;

export default function CreateTenantForm() {
  const router = useRouter();
  const progress = useProgressBar();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TenantFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(tenantSchema),
  });

  const handleSubmit: SubmitHandler<TenantFormValues> = async (data) => {
    startTransition(async () => {
      progress.start();
      const [error, tenant] = await createTenant(data);

      if (error || !tenant) {
        toast.error(error);
        return;
      }

      toast.success(`Tenant ${tenant.name} created successfully`);
      router.push(`/u/tenants/${tenant.id}`);
    });
  };

  return (
    <HookForm {...form}>
      <form
        className="mt-10 flex w-full max-w-lg flex-col items-center gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <HookForm.Input name="name" label="Name" placeholder="Tenant name" />
        <HookForm.Textarea name="description" label="Description" placeholder="Tenant description" rows={3} />
        <div>
          <Button disabled={isPending}>Create tenant</Button>
        </div>
      </form>
    </HookForm>
  );
}
