'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { Tenant } from '@/types/app.types';

import { updateTenant } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { tenantSchema } from '@/schema';

interface TenantDetailsProps {
  tenant: Tenant;
}

type TenantFormValues = z.infer<typeof tenantSchema>;
const TextInput = HookForm.Input<TenantFormValues>;
const TextareaInput = HookForm.Textarea<TenantFormValues>;

export default function TenantDetails(props: TenantDetailsProps) {
  const router = useRouter();
  const { tenant } = props;

  const progress = useProgressBar();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TenantFormValues>({
    defaultValues: {
      name: tenant.name,
      description: tenant.description,
    },
    resolver: zodResolver(tenantSchema),
  });

  const handleSubmit: SubmitHandler<TenantFormValues> = async (data) => {
    startTransition(async () => {
      progress.start();

      const [error] = await updateTenant(tenant.id, data);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Tenant details updated');
      form.reset({}, { keepValues: true });
      router.refresh();
    });
  };

  return (
    <HookForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tenant details</CardTitle>
            <CardDescription>Manage your tenant settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8">
              <TextInput name="name" label="Tenant name" placeholder="Tenant name" />
              <TextareaInput name="description" label="Tenant description" placeholder="Tenant description" rows={3} />
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button type="submit" disabled={isPending || !form.formState.isDirty}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </HookForm>
  );
}
