'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { updateProvider } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { providerSchema } from '@/schema';

import { useProviderContext } from '../../_blocks/ProviderContext';

type ProviderFormValues = z.infer<typeof providerSchema>;

export default function ProviderDetails() {
  const router = useRouter();
  const { provider } = useProviderContext();

  const progress = useProgressBar();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProviderFormValues>({
    defaultValues: {
      name: provider.name,
      description: provider.description,
    },
    resolver: zodResolver(providerSchema),
  });

  const handleSubmit: SubmitHandler<ProviderFormValues> = async (data) => {
    startTransition(async () => {
      progress.start();

      const [error] = await updateProvider(provider.id, data);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Provider details updated');
      form.reset({}, { keepValues: true });
      router.refresh();
    });
  };

  return (
    <HookForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Provider details</CardTitle>
            <CardDescription>Manage your provider settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8">
              <HookForm.Input name="name" label="Provider name" placeholder="Provider name" />
              <HookForm.Textarea
                name="description"
                label="Provider description"
                placeholder="Provider description"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={isPending || !form.formState.isDirty}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </HookForm>
  );
}
