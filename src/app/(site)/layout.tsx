import Image from 'next/image';
import Link from 'next/link';

import darkLogo from '@/assets/logos/dark-logo-wordmark.png';
import lightLogo from '@/assets/logos/light-logo-wordmark.png';

const Footer = () => {
  return (
    <footer className="-mx-4 border-t py-8">
      <div className="mx-auto flex max-w-7xl">
        <div className="flex items-center justify-center">
          <p className="font-mediumfont-mono text-sm">© 2024 useGrant</p>
        </div>
        <div className="ml-auto">
          <div>
            <p className="font-medium">Legal</p>
            <div className="mt-3 flex flex-col gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="relative px-4">
        <Link href="/">
          <div className="absolute left-10 top-10">
            <Image src={darkLogo} alt="logo" width={130} className="hidden dark:block" />
            <Image src={lightLogo} alt="logo" width={130} className="dark:hidden" />
          </div>
        </Link>
        {children}
        <Footer />
      </section>
    </>
  );
}
