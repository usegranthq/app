import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register for an account with useGrant.dev.',
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-dvh">
      <div className="absolute top-6 right-6">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
