import Link from 'next/link';

import PointerHighlight from '@/shadcn/components/external/pointer-highlight';
import { Button } from '@/shadcn/components/ui/button';

import env from '@/env';

import DynamicEnv from './DyanmicEnv';
import PlatformsSection from './Platforms';
import PricingSection from './Pricing';
import TrustBasedAccess from './TrustBasedAccess';
import ZeroTrustSection from './ZeroTrust';

export default async function Home() {
  const isInviteOnly = env.INVITE_TOKEN !== '';

  return (
    <>
      <div className="relative flex h-[30rem] w-full items-center justify-center md:h-[36rem]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="z-10 mx-auto flex flex-col items-center justify-center gap-8">
          <div>
            <h1 className="text-center text-3xl font-bold md:text-5xl">Automate Machine-to-Machine Auth</h1>
            <div className="mx-auto mt-2.5 max-w-xl text-center text-base font-medium text-gray-400">
              Set up secure M2M authentication that scales in seconds. Built on OAuth standards for
              <PointerHighlight className="ml-1 inline-block">maximum security.</PointerHighlight>
            </div>
          </div>
          {isInviteOnly && (
            <p className="text-center text-base font-semibold text-primary md:text-lg">
              Signups are invite-only. Stay tuned!
            </p>
          )}
          {!isInviteOnly && (
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
        </div>
      </div>
      <TrustBasedAccess />
      <DynamicEnv />
      <ZeroTrustSection />
      <PlatformsSection />
      <PricingSection />
      {isInviteOnly && (
        <div className="my-44 flex flex-col items-center gap-4">
          <p className="text-center text-base font-semibold text-primary md:text-lg">
            Signups are invite-only. Stay tuned!
          </p>
        </div>
      )}
      {!isInviteOnly && (
        <div className="my-44 flex flex-col items-center gap-4">
          <h2 className="text-center text-4xl font-semibold">Get started today!</h2>
          <div className="mx-auto mt-4 flex items-center gap-4">
            <Button asChild>
              <Link href="/login">Get started</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs">Read the docs</a>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
