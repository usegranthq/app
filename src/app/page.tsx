import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import constants from '@/constants';

import darkLogo from '@/assets/logos/dark-logo-wordmark.png';
import lightLogo from '@/assets/logos/light-logo-wordmark.png';

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(constants.AUTH_COOKIE);

  return (
    <div className="relative mx-auto flex min-h-dvh flex-col items-center justify-center gap-8">
      <div className="absolute left-4 top-6 bg-black/20">
        <Image src={darkLogo} alt="logo" width={130} className="hidden dark:block" />
        <Image src={lightLogo} alt="logo" width={130} className="dark:hidden" />
      </div>
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
