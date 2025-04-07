'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shadcn/components/ui/alert-dialog';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';

import { createApiKey } from '@/actions';
import CopyInput from '@/components/CopyInput';

const expirationOptions = [
  { label: '1 day', value: 1 },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '60 days', value: 60 },
  { label: '90 days', value: 90 },
  { label: '180 days', value: 180 },
  { label: '1 Year', value: 365 },
  { label: 'No Expiration', value: 0 },
];

const CreateApiKeyButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="ml-auto" disabled={pending}>
      {pending ? 'Creating api key...' : 'Create'}
    </Button>
  );
};

export default function CreateApiKey() {
  const formRef = useRef<HTMLFormElement>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();
  const [selectKey, setSelectKey] = useState(new Date().getTime());

  const handleSubmit = async (formData: FormData) => {
    const [error, apiKey] = await createApiKey(formData);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success('API key created successfully');
    formRef.current?.reset();
    setSelectKey(new Date().getTime());
    setApiKey(apiKey);
    router.refresh();
  };

  const handleApiKeyClose = useCallback(() => {
    setApiKey(null);
  }, []);

  return (
    <>
      <AlertDialog open={apiKey !== null} onOpenChange={handleApiKeyClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Please copy this api key and store it in a secure location. You will not be able to see it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <CopyInput value={apiKey ?? ''} />
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>I&apos;ve saved it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form ref={formRef} action={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create a new api key</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create a new api key to access your account. Make sure the names are unique to differentiate them from
              other api keys.
              <br />
              And keep them in a secure location.
            </CardDescription>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex flex-col gap-2 md:flex-1">
                <Label>NAME</Label>
                <Input name="name" required maxLength={32} minLength={3} placeholder="API Key Name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>EXPIRATION</Label>
                <Select name="expiration" key={selectKey}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="items-center">
            <CreateApiKeyButton />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
