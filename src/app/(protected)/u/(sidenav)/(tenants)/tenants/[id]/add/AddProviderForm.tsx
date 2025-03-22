'use client';

import { useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';

import { createTenantProvider, fetchFingerprint } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { tenantProviderSchema } from '@/schema';

interface AddProviderFormProps {
  tenantId: string;
}

type TenantFormValues = z.infer<typeof tenantProviderSchema>;
const TextInput = HookForm.Input<TenantFormValues>;
const NumberInput = HookForm.Number<TenantFormValues>;
const SelectInput = HookForm.Select<TenantFormValues>;

export default function AddProviderForm({ tenantId }: AddProviderFormProps) {
  const router = useRouter();
  const progress = useProgressBar();
  const formRef = useRef<HTMLFormElement>(null);
  const [isFingerprintPending, startFingerprintTransition] = useTransition();
  const [isSubmitting, startFormTransition] = useTransition();

  const form = useForm<TenantFormValues>({
    defaultValues: {
      url: '',
      fingerprints: [''],
      audience: '',
      earliestIssuanceTimeAllowed: 1,
      conditions: [
        {
          key: 'sub',
          operator: 'stringEquals',
          value: '',
        },
      ],
    },
    resolver: zodResolver(tenantProviderSchema),
  });

  const handleSubmit = async (data: TenantFormValues) => {
    startFormTransition(async () => {
      progress.start();

      const [errorMessage] = await createTenantProvider(tenantId, data);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success(`Tenant provider created successfully`);
      router.push(`/u/tenants/${tenantId}`);
    });
  };

  const handleFetchFingerprint = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isValid = await form.trigger('url');
    if (!isValid) return;

    const url = form.getValues('url');

    startFingerprintTransition(async () => {
      progress.start();

      const [errorMessage, fingerprint] = await fetchFingerprint(url);
      if (errorMessage || !fingerprint) {
        toast.error(errorMessage);
        return;
      }

      form.setValue('fingerprints.0', fingerprint);
      form.clearErrors('fingerprints.0');
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
        <TextInput
          name="url"
          label="Provider URL"
          placeholder="https://"
          description={
            <>
              Specify the secure OpenID Connect URL for authentication requests. URL must start with{' '}
              <code>https://</code>.
            </>
          }
        />
        <div className="flex gap-2 w-full">
          <div className="w-full">
            <TextInput name="fingerprints.0" label="Fingerprint" placeholder="Identity provider fingerprint" readOnly />
          </div>

          <Button
            type="button"
            variant="outline"
            className="relative mt-5.5"
            onClick={handleFetchFingerprint}
            disabled={isFingerprintPending}
          >
            Fetch fingerprint
          </Button>
        </div>

        <TextInput name="audience" label="Audience" placeholder="Identity provider audience" />

        <NumberInput
          name="earliestIssuanceTimeAllowed"
          label="Earliest Issuance Time allowed (optional - in hours)"
          placeholder="Earliest issuance time allowed"
          min={1}
          max={12}
        />

        <div className="grid w-full gap-2">
          <Label>Conditions</Label>
          <div className="grid grid-cols-12 gap-4 mt-2 w-full">
            <div className="grid gap-2 col-span-3 items-start">
              <SelectInput name="conditions.0.key" label="Key" placeholder="Select a key">
                <HookForm.SelectItem value="sub">sub</HookForm.SelectItem>
              </SelectInput>
            </div>
            <div className="grid gap-2 col-span-4 items-start">
              <SelectInput name="conditions.0.operator" label="Operator" placeholder="Select an operator">
                <HookForm.SelectItem value="stringEquals">StringEquals</HookForm.SelectItem>
                <HookForm.SelectItem value="stringNotEquals">StringNotEquals</HookForm.SelectItem>
                <HookForm.SelectItem value="stringLike">StringLike</HookForm.SelectItem>
                <HookForm.SelectItem value="stringNotLike">StringNotLike</HookForm.SelectItem>
              </SelectInput>
            </div>
            <div className="grid gap-2 col-span-5 w-full items-start">
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
