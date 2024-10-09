'use client';

import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import SubmitButton from './SubmitButton';
import { loginWithEmail } from './actions';
import { toast } from 'sonner';

export default function LoginForm() {
  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await loginWithEmail(formData);
    } catch {
      toast.error('ooops');
    }
  };

  return (
    <form className="grid gap-4" action={handleFormSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required placeholder="user@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="flex text-xs">
        <div className="ml-auto">
          <Link href="/forgot-password" className="font-medium hover:underline underline-offset-2">
            Forgot your password?
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
