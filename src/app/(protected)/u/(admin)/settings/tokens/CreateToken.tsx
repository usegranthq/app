'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { createToken } from '@/actions/settings';
import CopyInput from '@/blocks/CopyInput';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const CreateTokenButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="ml-auto" disabled={pending}>
      {pending ? 'Creating api token...' : 'Create'}
    </Button>
  );
};

export default function CreateToken() {
  const formRef = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const [error, token] = await createToken(formData);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Token created successfully');
    formRef.current?.reset();
    setToken(token);
    router.refresh();
  };

  const handleTokenClose = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <>
      <AlertDialog open={token !== null} onOpenChange={handleTokenClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your API Token</AlertDialogTitle>
            <AlertDialogDescription>
              Please copy this token and store it in a secure location. You will not be able to see it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <CopyInput value={token ?? ''} />
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>I&apos;ve saved it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form ref={formRef} action={handleSubmit}>
        <CardContent>
          <CardDescription>
            Create a new token to access your account. Make sure the names are unique to differentiate them from other
            tokens.
            <br />
            And keep them in a secure location.
          </CardDescription>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:gap-8">
            <div className="flex flex-col gap-2 md:flex-1">
              <Label>NAME</Label>
              <Input name="name" required maxLength={32} minLength={3} placeholder="Token Name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>EXPIRATION</Label>
              <Select name="expiration">
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
          <CreateTokenButton />
        </CardFooter>
      </form>
    </>
  );
}
