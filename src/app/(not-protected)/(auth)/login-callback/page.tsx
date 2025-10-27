'use client';

import { useEffect } from 'react';

import ROUTES from '@/constants/routes';
import Spinner from '@/components/Spinner';

// just redirects to dashboard assuming the user is logged in
// this is used to handle the redirect from the oauth providers and magic links
// since the samesite cookie attribute is set to strict
// we need to redirect to a page that is on our domain
// and then have that page redirect to the dashboard
export default function LoginCallback() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = ROUTES.DASHBOARD;
    }, 0);
  }, []);

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <h1 className="font-mono font-bold tracking-wider">Please wait. Trying to log you in...</h1>
      </div>
    </div>
  );
}
