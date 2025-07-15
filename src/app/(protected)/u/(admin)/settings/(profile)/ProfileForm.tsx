'use client';

import { startTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { updateProfile } from '@/actions';
import HookForm from '@/components/HookForm';
import { useProgressBar } from '@/components/NavProgress';
import { profileSchema } from '@/schema';
import { User } from '@/types';

type ProfileFormValues = z.infer<typeof profileSchema>;

const TextInput = HookForm.Input<ProfileFormValues>;

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const progress = useProgressBar();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: user.email,
    },
    resolver: zodResolver(profileSchema),
  });

  const handleSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    startTransition(async () => {
      progress.start();
      const [error] = await updateProfile(data);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset(undefined, { keepDefaultValues: true });
      toast.success(`An email verification link has been sent to ${data.email}.`);
    });
  };

  return (
    <div className="grid gap-6">
      <HookForm {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription className="mt-2">
                <p>
                  This is the email address associated with your useGrant account. It is used for authentication over
                  web and sending account-related notifications.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextInput name="email" label="Email" placeholder="user@example.com" />
            </CardContent>
            <CardFooter>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </form>
      </HookForm>
    </div>
  );
}
