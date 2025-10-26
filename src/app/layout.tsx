import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import fonts from './fonts';

import './globals.css';

import env from '@/env';
import { register } from '@/instrumentation';

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
register();

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
