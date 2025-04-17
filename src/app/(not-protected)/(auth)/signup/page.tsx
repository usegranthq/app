import { Suspense } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import env from '@/env';

import LoginForm from '../login/LoginForm';
import OauthButtons from '../login/OauthButtons';
import RedirectErrorRenderer from '../login/RedirectErrorRenderer';
import Seperator from '../login/Seperator';
import Terms from '../login/Terms';

const TURNSTILE_SITE_KEY = env.TURNSTILE_SITE_KEY;

export default function Signup() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-sm space-y-4 rounded-xl p-5 shadow-xs">
        <CardHeader className="gap-1">
          <CardTitle className="text-2xl font-bold">
            Welcome <span>🙌</span>
          </CardTitle>
          <CardDescription className="sr-only">Create an account</CardDescription>
          <p className="text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{' '}
            <Link href="/login" className="hover:underline underline-offset-4">
              Login
            </Link>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <OauthButtons />
          <Seperator />
          <LoginForm turnstileSiteKey={TURNSTILE_SITE_KEY} submitButtonText="Sign up" />
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
