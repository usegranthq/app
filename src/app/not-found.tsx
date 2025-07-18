import { headers } from 'next/headers';
import Link from 'next/link';
import { getSessionCookie } from 'better-auth/cookies';

import { Button } from '@/shadcn/components/ui/button';
import { Separator } from '@/shadcn/components/ui/separator';

import ROUTES from '@/constants/routes';
import * as constants from '@/constants';

export default async function NotFound() {
  const headersList = new Headers(await headers());
  const sessionCookie = getSessionCookie(headersList, { cookiePrefix: constants.COOKIE_PREFIX });

  const isLoggedIn = !!sessionCookie;

  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="flex h-8 items-center gap-4">
        <h1 className="text-2xl font-medium">404</h1>
        <Separator orientation="vertical" />
        <p className="text-sm">The page you are looking for does not exist.</p>
      </div>
      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href={isLoggedIn ? ROUTES.DASHBOARD : ROUTES.ROOT}>
            {isLoggedIn ? 'Back to dashboard' : 'Back to home'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
