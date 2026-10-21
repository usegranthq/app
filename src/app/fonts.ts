import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Fira_Code, Fragment_Mono, Instrument_Sans, Inter, JetBrains_Mono, Oxanium } from 'next/font/google';

const oxanium = Oxanium({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oxanium',
  weight: ['400', '700'],
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
  weight: ['400'],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jet-brains-mono',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
  weight: ['400', '500', '600', '700'],
});

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fragment-mono',
  weight: ['400'],
});

const fonts = [
  GeistSans.variable,
  GeistMono.variable,
  oxanium.variable,
  firaCode.variable,
  jetBrainsMono.variable,
  inter.variable,
  instrumentSans.variable,
  fragmentMono.variable,
];

export default fonts;
