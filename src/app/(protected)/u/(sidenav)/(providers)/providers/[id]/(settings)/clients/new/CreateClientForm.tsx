'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { createClient } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { clientSchema } from '@/schema';
import { Button } from '@/shadcn/components/ui/button';

type ClientFormValues = z.infer<typeof clientSchema>;

export default function CreateClientForm({ id }: { id: string }) {
  const router = useRouter();
  const progress = useProgressBar();
  const [isSubmitting, startFormTransition] = useTransition();

  const form = useForm<ClientFormValues>({
    defaultValues: {
      name: '',
      audience: '',
    },
    resolver: zodResolver(clientSchema),
  });

  const handleSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    startFormTransition(async () => {
      progress.start();

      const [error] = await createClient(id, data);
      if (error) {
        toast.error(error);
        return;
      }

      toast.success(`Client created successfully`);
      router.push(`/u/providers/${id}`);
    });
  };

  return (
    <HookForm {...form}>
      <form
        className="mt-10 flex w-full max-w-sm flex-col items-center gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <HookForm.Input name="name" label="Name" placeholder="Client name" />
        <HookForm.Input name="audience" label="Audience" placeholder="sts.amazonaws.com" />
        <div>
          <Button disabled={isSubmitting}>Create client</Button>
        </div>
      </form>
    </HookForm>
  );
}
