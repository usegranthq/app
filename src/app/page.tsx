import { cookies } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import constants from '@/constants';

export default function Home() {
  const isLoggedIn = cookies().get(constants.AUTH_COOKIE);

  return (
    <div className="mx-auto flex min-h-dvh flex-col items-center justify-center gap-8">
      <div>
        <h1 className="text-center text-5xl font-bold">Simplify Machine-to-Machine Auth</h1>
        <p className="mx-auto mt-2.5 max-w-xl text-center text-base font-medium text-gray-400">
          Set up secure M2M authentication in minutes. Built on OAuth/OpenID standards for maximum security.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/login">{isLoggedIn ? 'Launch app 🚀' : 'Get started'}</Link>
        </Button>
        <Button variant="secondary">Read the guides</Button>
      </div>
    </div>
  );
}
