import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'useGrant',
  description: 'Effortless machine to machine grant setup',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} mx-auto max-w-screen-2xl font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
