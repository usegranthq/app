import { IBM_Plex_Mono, Libre_Baskerville } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre-baskerville',
  weight: ['400', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
});

const fonts = [GeistSans.variable, GeistMono.variable, ibmPlexMono.variable, libreBaskerville.variable];

export default fonts;
