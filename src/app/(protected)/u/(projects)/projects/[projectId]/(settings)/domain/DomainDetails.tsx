'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { startTransition } from 'react';

import { addDomain } from '@/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Domain, Project } from '@/types/app.types';
import { useProgressBar } from '@/blocks/NavProgress';

interface DomainDetailsProps {
  project: Project;
  defaultDomain: string;
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

export default function DomainDetails({ defaultDomain, project }: DomainDetailsProps) {
  const progress = useProgressBar();

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
      progress.start();
      const [errorMessage] = await addDomain(project.id, formData);

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
        <CardTitle>Project Domain</CardTitle>
        <CardDescription>
          Below are the details of your project&apos;s domain and its Certificate Authority (CA) thumbprint.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <form className="flex items-center gap-8" action={handleFormSubmit}>
          <div className="grid w-full gap-2">
            <Label>Domain Name</Label>
            <div className="flex w-full items-center space-x-4">
              <Input type="text" name="domain" required minLength={3} maxLength={255} placeholder="mywebsite.com" />
              <AddButton />
            </div>
          </div>
        </form>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Your default project&apos;s domain is{' '}
            <Link
              href={`${defaultDomain}/.well-known/openid-configuration`}
              target="_blank"
              className="font-bold hover:underline"
            >
              {defaultDomain}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
