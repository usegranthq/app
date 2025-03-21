'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { Input } from '@/shadcn/components/ui/input';

import { verify } from '@/actions';

import SubmitButton from './SubmitButton';

interface VerifyFormProps {
  email: string;
}

export default function VerifyForm({ email }: VerifyFormProps) {
  const handleFormSubmit = async (formData: FormData) => {
    formData.set('email', email);
    const [errorMessage] = await verify(formData);

    if (errorMessage) {
      toast.error(errorMessage);
    }
  };

  return (
    <form className="grid gap-4" action={handleFormSubmit}>
      <div className="grid gap-2">
        <Input id="code" name="code" type="text" required placeholder="e.g., dragon-slayer-quest" />
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm hover:underline">
          {'<- '}
          Back to login
        </Link>
      </div>
    </form>
  );
}
