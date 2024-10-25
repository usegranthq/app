// import { cookies } from 'next/headers';
// import Link from 'next/link';

import Image from 'next/image';
import PricingSection from './Pricing';
import ZeroTrustSection from './ZeroTrust';

import landerImg from './lander.png';
import TrustBasedAccess from './TrustBasedAccess';
import DynamicEnv from './DyanmicEnv';

// import { Button } from '@/components/ui/button';
// import constants from '@/constants';

export default async function Home() {
  // const cookieStore = await cookies();
  // const isLoggedIn = cookieStore.get(constants.AUTH_COOKIE);

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center gap-8 lg:min-h-dvh">
        <div className="mt-20 md:mt-56">
          <h1 className="text-center text-3xl font-bold md:text-5xl">Simplify Machine-to-Machine Auth</h1>
          <p className="mx-auto mt-2.5 max-w-xl text-center text-base font-medium text-gray-400">
            Set up secure M2M authentication in minutes. Built on OAuth/OpenID standards for maximum security.
          </p>
        </div>
        <div className="text-center text-base font-semibold text-primary md:text-lg">
          Signups are invite-only. Stay tuned!
        </div>
        <div className="mt-10 max-w-5xl overflow-hidden rounded-lg border border-border shadow-lg md:mt-20">
          <Image src={landerImg} alt="UseGrant" priority />
        </div>

        {/* <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/login">{isLoggedIn ? 'Launch app 🚀' : 'Get started'}</Link>
        </Button>
        <Button variant="secondary">Read the guides</Button>
      </div> */}
      </div>
      <TrustBasedAccess />
      <DynamicEnv />
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
