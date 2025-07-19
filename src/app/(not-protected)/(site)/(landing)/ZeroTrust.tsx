import { ReactNode } from 'react';
import { GalleryHorizontalEndIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';

export default function ZeroTrust() {
  return (
    <section className="mt-20 py-16 md:mt-32 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-balance lg:text-5xl">Built to scale, built for security</h2>
          <p className="mt-4 text-muted-foreground">
            Every component designed with zero-knowledge architecture and privacy-first principles.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="group border-0 bg-background shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <ShieldCheckIcon className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Zero Trust</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Complete data isolation with no visibility into your services or usage patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-background shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <GalleryHorizontalEndIcon className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Multi-Tenant</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Isolated domain for each provider with enterprise-grade scalability.</p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-background shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <ZapIcon className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Instant Provisioning</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Instantly provision your tenant or provider in less than 100 milliseconds.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div aria-hidden className="absolute inset-0 bg-radial from-transparent to-background to-75%" />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-white dark:bg-background">
      {children}
    </div>
  </div>
);
