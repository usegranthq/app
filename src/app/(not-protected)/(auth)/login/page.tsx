import { Suspense } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import env from '@/env';

import LoginForm from './LoginForm';
import OauthButtons from './OauthButtons';
import RedirectErrorRenderer from './RedirectErrorRenderer';
import Seperator from './Seperator';
import Terms from './Terms';

const TURNSTILE_SITE_KEY = env.TURNSTILE_SITE_KEY;

export default function Login() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-sm space-y-4 rounded-xl p-5 shadow-xs">
        <CardHeader className="gap-1">
          <CardTitle className="text-2xl font-bold">
            Hey there <span>👋</span>
          </CardTitle>
          <CardDescription className="sr-only">Login to your account</CardDescription>
          <p className="text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account?</span>{' '}
            <Link href="/signup" className="hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <OauthButtons />
          <Seperator />
          <LoginForm turnstileSiteKey={TURNSTILE_SITE_KEY} />
        </CardContent>
        <CardFooter>
          <Terms />
        </CardFooter>
      </Card>
      <Suspense>
        <RedirectErrorRenderer />
      </Suspense>
    </div>
  );
}
