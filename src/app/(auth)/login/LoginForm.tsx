'use client';

import { toast } from 'sonner';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import SubmitButton from './SubmitButton';
import { login } from '@/actions';

interface LoginFormProps {
  turnstileSiteKey: string;
}

export default function LoginForm({ turnstileSiteKey }: LoginFormProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleFormSubmit = async (formData: FormData) => {
    const [errorMessage] = await login(formData);

    if (errorMessage) {
      toast.error(errorMessage);
    }

    if (!turnstileRef.current) {
      return;
    }

    turnstileRef.current.reset();
  };

  return (
    <form className="grid gap-4" action={handleFormSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required placeholder="user@example.com" />
        <div className="mt-4 h-20">
          <Turnstile siteKey={turnstileSiteKey} ref={turnstileRef} />
        </div>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
