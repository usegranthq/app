import Image from 'next/image';
import Link from 'next/link';

import darkLogo from '@/assets/logos/dark-logo-wordmark.png';
import lightLogo from '@/assets/logos/light-logo-wordmark.png';

const Footer = () => {
  return (
    <footer className="-mx-4 border-t py-8">
      <div className="mx-auto flex max-w-7xl max-sm:flex-col max-sm:px-4">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm font-medium">© 2024 useGrant. All rights reserved.</p>
          <p className="font-mono text-sm font-medium text-muted-foreground">support@usegrant.com</p>
        </div>
        <div className="mt-8 md:ml-auto md:mt-0">
          <div>
            <p className="font-medium">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm md:gap-4">
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
          <div className="absolute left-4 top-8 md:left-10 md:top-10">
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
