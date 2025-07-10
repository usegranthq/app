'use client';

import { useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';

import ROUTES from '@/constants/routes';
import { createTenantProviderPolicy } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { tenantProviderPolicySchema } from '@/schema';
import { TenantProvider } from '@/types/app.types';

interface AddPolicyFormProps {
  tenantId: string;
  tenantProvider: TenantProvider;
}

type TenantPolicyFormValues = z.infer<typeof tenantProviderPolicySchema>;
const TextInput = HookForm.Input<TenantPolicyFormValues>;
const SelectInput = HookForm.Select<TenantPolicyFormValues>;

export default function AddPolicyForm({ tenantId, tenantProvider }: AddPolicyFormProps) {
  const router = useRouter();
  const progress = useProgressBar();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, startFormTransition] = useTransition();

  const form = useForm<TenantPolicyFormValues>({
    defaultValues: {
      name: '',
      description: '',
      audience: tenantProvider.audience,
      conditions: [
        {
          key: 'sub',
          operator: 'stringEquals',
          value: '',
        },
      ],
    },
    resolver: zodResolver(tenantProviderPolicySchema),
  });

  const handleSubmit = async (data: TenantPolicyFormValues) => {
    startFormTransition(async () => {
      progress.start();

      const [errorMessage] = await createTenantProviderPolicy(tenantId, tenantProvider.id, data);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success(`Tenant provider created successfully`);
      router.push(ROUTES.TENANTS_ID_PROVIDERS_ID(tenantId, tenantProvider.id));
    });
  };

  return (
    <HookForm {...form}>
      <form
        ref={formRef}
        className="mt-10 flex w-full flex-col items-center gap-8"
        id="addProviderForm"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <TextInput name="name" label="Name" placeholder="Policy name" />

        <TextInput name="description" label="Description" placeholder="Policy description" />
        <TextInput name="audience" label="Audience" placeholder="Audience" />

        <div className="grid w-full gap-2">
          <Label>Conditions</Label>
          <div className="mt-2 grid w-full grid-cols-12 gap-4">
            <div className="col-span-3 grid items-start gap-2">
              <SelectInput name="conditions.0.key" label="Key" placeholder="Select a key">
                <HookForm.SelectItem value="sub">sub</HookForm.SelectItem>
              </SelectInput>
            </div>
            <div className="col-span-4 grid items-start gap-2">
              <SelectInput name="conditions.0.operator" label="Operator" placeholder="Select an operator">
                <HookForm.SelectItem value="stringEquals">StringEquals</HookForm.SelectItem>
                <HookForm.SelectItem value="stringNotEquals">StringNotEquals</HookForm.SelectItem>
                <HookForm.SelectItem value="stringLike">StringLike</HookForm.SelectItem>
                <HookForm.SelectItem value="stringNotLike">StringNotLike</HookForm.SelectItem>
              </SelectInput>
            </div>
            <div className="col-span-5 grid w-full items-start gap-2">
              <TextInput name="conditions.0.value" label="Value" placeholder="Value" />
            </div>
          </div>
        </div>
        <div>
          <Button disabled={isSubmitting}>Add identity provider</Button>
        </div>
      </form>
    </HookForm>
  );
}
