import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import env from '@/env';

import './globals.css';
import fonts from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: 'useGrant',
  description: 'Effortless machine to machine grant setup',
  pinterest: {
    richPin: true,
  },
  openGraph: {
    title: 'useGrant',
    description: 'Effortless machine to machine grant setup',
    images: ['/og.png'],
    siteName: 'useGrant',
  },
};

const fontClasses = fonts.join(' ');

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html
      lang="en"
      className={`${fontClasses} dark scroll-smooth antialiased`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className={`mx-auto max-w-(--breakpoint-2xl)`}>{children}</body>
    </html>
  );
}
