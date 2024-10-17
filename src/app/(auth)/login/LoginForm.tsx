'use client';

import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import SubmitButton from './SubmitButton';
import { login } from '@/actions';

export default function LoginForm() {
  const handleFormSubmit = async (formData: FormData) => {
    const [errorMessage] = await login(formData);

    if (errorMessage) {
      toast.error(errorMessage);
    }
  };

  return (
    <form className="grid gap-4" action={handleFormSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required placeholder="user@example.com" />
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
