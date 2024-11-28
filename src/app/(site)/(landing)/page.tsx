import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import PricingSection from './Pricing';
import ZeroTrustSection from './ZeroTrust';
import DynamicEnv from './DyanmicEnv';
import TrustBasedAccess from './TrustBasedAccess';

import landerDarkImg from './lander-dark.png';
import landerLightImg from './lander-light.png';

export default async function Home() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center gap-8 lg:min-h-dvh">
        <div className="mt-44 md:mt-56">
          <h1 className="text-center text-3xl font-bold md:text-5xl">Simplify Machine-to-Machine Auth</h1>
          <p className="mx-auto mt-2.5 max-w-xl text-center text-base font-medium text-gray-400">
            Set up secure M2M authentication in minutes. Built on OAuth/OpenID standards for maximum security.
          </p>
        </div>
        {isProduction && (
          <p className="text-center text-base font-semibold text-primary md:text-lg">
            Signups are invite-only. Stay tuned!
          </p>
        )}
        {!isProduction && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/login">🚀 Get started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Early Access Now Available for limited users - <br className="block md:hidden" /> Be Among the First to
              Try!
            </p>
          </div>
        )}
        <div className="mt-10 max-w-5xl overflow-hidden rounded-lg border border-border shadow-lg md:mt-20">
          <Image src={landerDarkImg} alt="UseGrant" className="hidden dark:block" priority />
          <Image src={landerLightImg} alt="UseGrant" className="block dark:hidden" priority />
        </div>
      </div>
      <TrustBasedAccess />
      <DynamicEnv />
      <ZeroTrustSection />
      <PricingSection />
      {isProduction && (
        <div className="my-44 flex flex-col items-center gap-4">
          <p className="text-center text-base font-semibold text-primary md:text-lg">
            Signups are invite-only. Stay tuned!
          </p>
        </div>
      )}
      {!isProduction && (
        <div className="my-44 flex flex-col items-center gap-4">
          <h2 className="text-center text-4xl font-semibold">Get started today!</h2>
          <div className="mx-auto mt-4 flex items-center gap-4">
            <Button asChild>
              <Link href="/login">Get started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
