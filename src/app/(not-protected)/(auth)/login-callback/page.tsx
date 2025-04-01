'use client';

import { useEffect } from 'react';

import { ROUTES } from '@/constants/routes';

// just redirects to dashboard assuming the user is logged in
// this is used to handle the redirect from the oauth providers
// since the samesite cookie attribute is set to strict
// we need to redirect to a page that is on our domain
// and then have that page redirect to the dashboard
export default function LoginCallback() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = ROUTES.DASHBOARD;
    }, 0);
  }, []);

  return 'Please wait...';
}
