import Image from 'next/image';
import Link from 'next/link';

import darkLogo from '@/assets/logos/dark-logo-wordmark.png';
import lightLogo from '@/assets/logos/light-logo-wordmark.png';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/#pricing' },
  // { label: 'Docs', href: '/docs' },
];

export default function Navbar() {
  return (
    <header className="top-0 z-50 flex border-b bg-background md:sticky">
      <div className="ml-4 flex items-center">
        <Link href="/">
          <div className="left-4 top-8 md:left-10 md:top-10">
            <Image src={darkLogo} alt="logo" width={120} className="hidden flex-shrink-0 dark:block" />
            <Image src={lightLogo} alt="logo" width={120} className="flex-shrink-0 dark:hidden" />
          </div>
        </Link>
      </div>
      <div className="ml-auto">
        <nav className="">
          <ul className="flex items-center divide-x divide-border">
            {navItems.map((item) => (
              <li
                className="group relative px-6 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                key={`nav-item-${item.href}`}
              >
                <Link href={item.href}>{item.label}</Link>
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
