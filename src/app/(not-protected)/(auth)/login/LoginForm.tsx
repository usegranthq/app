'use client';

import { useRef } from 'react';
import Form from 'next/form';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from 'sonner';

import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';

import { login } from '@/actions';

import SubmitButton from './SubmitButton';

interface LoginFormProps {
  turnstileSiteKey: string;
  submitButtonText?: string;
}

export default function LoginForm(props: LoginFormProps) {
  const { turnstileSiteKey, submitButtonText = 'Sign in' } = props;
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleFormSubmit = async (formData: FormData) => {
    const token = formData.get('cf-turnstile-response');

    if (!token) {
      toast.warning('Captcha verification required.');
      return;
    }

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
    <Form className="grid gap-4" action={handleFormSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required placeholder="user@example.com" />
        <div className="mt-4 h-20">
          <Turnstile
            siteKey={turnstileSiteKey}
            ref={turnstileRef}
            options={{
              size: 'flexible',
            }}
          />
        </div>
      </div>
      <div>
        <SubmitButton text={submitButtonText} />
      </div>
    </Form>
  );
}
