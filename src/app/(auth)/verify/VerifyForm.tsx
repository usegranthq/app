'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';

import SubmitButton from './SubmitButton';
import { verify } from '@/actions';

export default function VerifyForm() {
  const handleFormSubmit = async (formData: FormData) => {
    const errorMessage = await verify(formData);

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
