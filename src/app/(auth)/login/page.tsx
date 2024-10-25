import { Suspense } from 'react';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

import LoginForm from './LoginForm';
import RedirectErrorRenderer from './RedirectErrorRenderer';

export default function Login() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-sm space-y-4 rounded-xl p-5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Hey there <span>👋</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link prefetch={false} href="/api/login/github">
                <SiGithub className="mr-2 size-4" />
                Github
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link prefetch={false} href="/api/login/google">
                <SiGoogle className="mr-2 size-4" />
                Google
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <LoginForm />
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
