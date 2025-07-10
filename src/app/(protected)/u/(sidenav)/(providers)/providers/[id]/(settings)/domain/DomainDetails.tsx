'use client';

import { startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';

import { Domain, Provider } from '@/types/app.types';

import { addDomain } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';

interface DomainDetailsProps {
  provider: Provider;
  domains: Domain[];
}

const AddButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Add
    </Button>
  );
};

export default function DomainDetails({ provider }: DomainDetailsProps) {
  const progress = useProgressBar();

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
      progress.start();
      const [errorMessage] = await addDomain(provider.id, formData);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success('Domain added');
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Domain</CardTitle>
        <CardDescription>
          Below are the details of your provider&apos;s domain and its Certificate Authority (CA) thumbprint.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <form className="mb-2 flex items-center gap-8" action={handleFormSubmit}>
          <div className="grid w-full gap-2">
            <Label>Domain Name</Label>
            <div className="flex w-full items-center space-x-4">
              <Input type="text" name="domain" required minLength={3} maxLength={255} placeholder="mywebsite.com" />
              <AddButton />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
