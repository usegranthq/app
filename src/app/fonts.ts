import { Fira_Code, Inter, JetBrains_Mono, Oxanium } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

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

const fonts = [
  GeistSans.variable,
  GeistMono.variable,
  oxanium.variable,
  firaCode.variable,
  jetBrainsMono.variable,
  inter.variable,
];

export default fonts;
