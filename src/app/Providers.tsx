import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';

import ThemeProvider from '@/components/ThemeProvider';
import { ColorProvider } from '@/contexts/ColorProvider';
import { Toaster } from '@/shadcn/components/ui/sonner';

interface ProvidersProps extends Readonly<PropsWithChildren> {
  nonce: string;
}

export default function Providers({ children, nonce }: ProvidersProps) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange nonce={nonce}>
        <ColorProvider nonce={nonce}>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster richColors />
        </ColorProvider>
      </ThemeProvider>
    </>
  );
}
