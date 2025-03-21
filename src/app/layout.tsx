import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { SITE_URL } from '@/lib/site';

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

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" className="dark scroll-smooth antialiased" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} mx-auto max-w-(--breakpoint-2xl) font-sans`}>
        {children}
      </body>
    </html>
  );
}
