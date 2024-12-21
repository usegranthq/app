'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useProgressBar } from '@/blocks/NavProgress';
import { createProvider } from '@/actions';

function CreateProviderButton() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Create provider</Button>;
}

export default function CreateProviderForm() {
  const router = useRouter();
  const progress = useProgressBar();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      progress.start();
      const [error, provider] = await createProvider(formData);

      if (error || !provider) {
        toast.error(error);
        return;
      }

      toast.success(`Provider ${provider.name} created successfully`);
      router.push(`/u/providers/${provider.id}`);
    });
  };

  return (
    <form className="mt-10 flex w-full max-w-sm flex-col items-center gap-8" action={handleSubmit}>
      <div className="grid w-full gap-2">
        <Label>Name</Label>
        <Input name="name" placeholder="Provider name" required minLength={3} maxLength={32} />
      </div>
      <div className="grid w-full gap-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          placeholder="Provider description"
          required
          minLength={3}
          maxLength={100}
          rows={3}
        />
      </div>
      <div>
        <CreateProviderButton />
      </div>
    </form>
  );
}
