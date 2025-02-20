import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { SITE_URL } from '@/lib/site';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { ColorProvider } from '@/contexts/ColorProvider';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'useGrant',
  description: 'Effortless machine to machine grant setup',
  openGraph: {
    title: 'useGrant',
    description: 'Effortless machine to machine grant setup',
    images: ['/og.png'],
    siteName: 'useGrant',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} mx-auto max-w-screen-2xl font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ColorProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster richColors />
          </ColorProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
