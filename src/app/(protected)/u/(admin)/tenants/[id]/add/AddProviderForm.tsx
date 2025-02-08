'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProgressBar } from '@/blocks/NavProgress';
import { createTenantProvider, fetchFingerprint } from '@/actions';

function AddProviderButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Add identity provider</Button>;
}

const getFormValues = (formId: string, name: string) => {
  const form = document.getElementById(formId) as HTMLFormElement;
  const el = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
  return el.value;
};

const setFormValues = (formId: string, name: string, value: string | null) => {
  const form = document.getElementById(formId) as HTMLFormElement;
  const el = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
  if (!value) return;
  el.value = value;
};

const setCustomValidity = (name: string, message: string) => {
  const form = document.getElementById('addProviderForm') as HTMLFormElement;
  const el = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
  el.setCustomValidity(message);
  el.reportValidity();
  el.setCustomValidity('');
};

interface AddProviderFormProps {
  tenantId: string;
}

export default function AddProviderForm({ tenantId }: AddProviderFormProps) {
  const router = useRouter();
  const progress = useProgressBar();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      progress.start();

      const [errorMessage] = await createTenantProvider(tenantId, formData);
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

    const url = getFormValues('addProviderForm', 'url');
    if (!url) {
      setCustomValidity('url', 'URL is required');
      return;
    }

    if (!url.startsWith('https://')) {
      setCustomValidity('url', 'URL must start with https://');
      return;
    }

    const [errorMessage, fingerprint] = await fetchFingerprint(url);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setFormValues('addProviderForm', 'fingerprint', fingerprint);
  };

  return (
    <form className="mt-10 flex w-full flex-col items-center gap-8" id="addProviderForm" action={handleSubmit}>
      <div className="grid w-full gap-2">
        <Label>Provider URL</Label>
        <Input
          type="url"
          name="url"
          placeholder="https://"
          required
          minLength={3}
          maxLength={255}
          pattern="https://.*"
        />
        <span className="text-xs text-muted-foreground">
          Specify the secure OpenID Connect URL for authentication requests. URL must start with <code>https://</code>.
        </span>
      </div>
      <div className="grid w-full gap-2">
        <Label>Fingerprint</Label>
        <div className="flex flex-row gap-2">
          <Input
            name="fingerprint"
            placeholder="Identity provider fingerprint"
            minLength={3}
            maxLength={32}
            required
            readOnly
          />
          <Button type="button" variant="outline" className="inline-flex" onClick={handleFetchFingerprint}>
            Fetch fingerprint
          </Button>
        </div>
      </div>
      <div className="grid w-full gap-2">
        <Label>Audience</Label>
        <Input name="audience" placeholder="Identity provider audience" required minLength={3} maxLength={32} />
      </div>
      <div className="grid w-full gap-2">
        <Label>Earliest Issuance Time allowed (optional)</Label>
        <Input
          type="number"
          name="earliestIssuanceTimeAllowed"
          min={0}
          max={12}
          placeholder="Earliest issuance time allowed"
          required
          minLength={3}
          maxLength={32}
        />
      </div>
      <div>
        <AddProviderButton />
      </div>
    </form>
  );
}
