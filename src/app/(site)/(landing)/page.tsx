// import { cookies } from 'next/headers';
// import Link from 'next/link';

import Image from 'next/image';
import PricingSection from './Pricing';
import ZeroTrustSection from './ZeroTrust';

import landerImg from './lander.png';

// import { Button } from '@/components/ui/button';
// import constants from '@/constants';

export default async function Home() {
  // const cookieStore = await cookies();
  // const isLoggedIn = cookieStore.get(constants.AUTH_COOKIE);

  return (
    <>
      <div className="mx-auto flex min-h-dvh flex-col items-center justify-center gap-8">
        <div className="mt-64">
          <h1 className="text-center text-5xl font-bold">Simplify Machine-to-Machine Auth</h1>
          <p className="mx-auto mt-2.5 max-w-xl text-center text-base font-medium text-gray-400">
            Set up secure M2M authentication in minutes. Built on OAuth/OpenID standards for maximum security.
          </p>
        </div>
        <div className="text-center text-lg font-semibold text-primary">Signups are invite-only. Stay tuned!</div>
        <div className="mt-20 overflow-hidden rounded-lg border border-border shadow-lg">
          <Image src={landerImg} alt="UseGrant" width={1000} height={2000} />
        </div>

        {/* <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/login">{isLoggedIn ? 'Launch app 🚀' : 'Get started'}</Link>
        </Button>
        <Button variant="secondary">Read the guides</Button>
      </div> */}
      </div>
      <ZeroTrustSection />
      <PricingSection />
      <div className="my-44">
        <h2 className="text-center text-4xl font-semibold">Stay tuned!</h2>
        <p className="mx-auto mt-2.5 max-w-xl text-center text-base font-medium text-primary">
          Signups are invite-only. Stay tuned!
        </p>
      </div>
    </>
  );
}
