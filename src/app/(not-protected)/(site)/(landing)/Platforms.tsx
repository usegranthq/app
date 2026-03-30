import { ShieldCheckIcon } from 'lucide-react';

import AlicloudIcon from '@/components/icons/alicloud';
import AwsIcon from '@/components/icons/aws';
import AzureIcon from '@/components/icons/azure';
import GcpIcon from '@/components/icons/gcp';
import LogoIcon from '@/components/icons/logo';
import NeonDbIcon from '@/components/icons/neondb';
import { cn } from '@/shadcn/lib/utils';

export default function PlatformsSection() {
  return (
    <section>
      <div className="py-24 md:mt-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative mx-auto flex max-w-sm items-center justify-between">
            <div className="space-y-6">
              <PlatformCard position="left-top">
                <AwsIcon />
              </PlatformCard>
              <PlatformCard position="left-middle">
                <AzureIcon />
              </PlatformCard>
              <PlatformCard position="left-bottom">
                <GcpIcon />
              </PlatformCard>
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="relative z-20 rounded-2xl border bg-muted p-1">
                <PlatformCard
                  className="shadow-black-950/10 size-16 border-black/25 shadow-xl dark:border-white/25 dark:bg-background dark:shadow-white/10"
                  isCenter={true}
                >
                  <LogoIcon />
                </PlatformCard>
              </div>
            </div>
            <div
              role="presentation"
              className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] opacity-50 [--dots-color:black] dark:[--dots-color:white]"
            ></div>

            <div className="space-y-6">
              <PlatformCard position="right-top">
                <AlicloudIcon />
              </PlatformCard>
              <PlatformCard position="right-middle">
                <NeonDbIcon />
              </PlatformCard>
              <PlatformCard position="right-bottom">
                <ShieldCheckIcon />
              </PlatformCard>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2 className="text-3xl font-semibold text-balance md:text-4xl">Authenticate with any provider</h2>
            <p className="text-muted-foreground">
              Authenticate seamlessly with any platforms that supports OAuth 2.0 client credentials grant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const PlatformCard = ({
  children,
  className,
  position,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom';
  isCenter?: boolean;
}) => {
  return (
    <div className={cn('relative flex size-12 rounded-xl border bg-background dark:bg-transparent', className)}>
      <div className={cn('relative z-20 m-auto size-fit *:size-7', isCenter && '*:size-12')}>{children}</div>
      {position && !isCenter && (
        <div
          className={cn(
            'absolute z-10 h-px bg-linear-to-r to-muted-foreground/25',
            position === 'left-top' && 'top-1/2 left-full w-[130px] origin-left rotate-[25deg]',
            position === 'left-middle' && 'top-1/2 left-full w-[120px] origin-left',
            position === 'left-bottom' && 'top-1/2 left-full w-[130px] origin-left rotate-[-25deg]',
            position === 'right-top' && 'top-1/2 right-full w-[130px] origin-right rotate-[-25deg] bg-linear-to-l',
            position === 'right-middle' && 'top-1/2 right-full w-[120px] origin-right bg-linear-to-l',
            position === 'right-bottom' && 'top-1/2 right-full w-[130px] origin-right rotate-[25deg] bg-linear-to-l',
          )}
        />
      )}
    </div>
  );
};
