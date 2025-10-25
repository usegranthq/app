'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/shadcn/components/ui/button';

import { createProvider } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { providerSchema } from '@/schema';

type ProviderFormValues = z.infer<typeof providerSchema>;

const TextInput = HookForm.Input<ProviderFormValues>;
const TextareaInput = HookForm.Textarea<ProviderFormValues>;

export default function CreateProviderForm() {
  const router = useRouter();
  const progress = useProgressBar();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProviderFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(providerSchema),
  });

  const handleSubmit: SubmitHandler<ProviderFormValues> = async (data) => {
    startTransition(async () => {
      progress.start();
      const [error, provider] = await createProvider(data);

      if (error || !provider) {
        toast.error(error);
        return;
      }

      toast.success(`Provider ${provider.name} created successfully`);
      router.push(`/u/providers/${provider.id}`);
    });
  };

  return (
    <HookForm {...form}>
      <form
        className="mt-10 flex w-full max-w-sm flex-col items-center gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <TextInput name="name" label="Name" placeholder="Provider name" />
        <TextareaInput name="description" label="Description" placeholder="Provider description" rows={3} />
        <div>
          <Button disabled={isPending}>Create provider</Button>
        </div>
      </form>
    </HookForm>
  );
}
