import { Suspense } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { env } from '@/env';

import LoginForm from './LoginForm';
import OauthButtons from './OauthButtons';
import RedirectErrorRenderer from './RedirectErrorRenderer';

const TURNSTILE_SITE_KEY = env.TURNSTILE_SITE_KEY;

export default function Login() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-sm space-y-4 rounded-xl p-5 shadow-xs">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Hey there <span>👋</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <OauthButtons />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 py-0.5 text-muted-foreground rounded">Or continue with</span>
            </div>
          </div>
          <LoginForm turnstileSiteKey={TURNSTILE_SITE_KEY} />
        </CardContent>
        <CardFooter className="text-center text-xs">
          <p>
            By continuing, you agree to our{' '}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
      <Suspense>
        <RedirectErrorRenderer />
      </Suspense>
    </div>
  );
}
