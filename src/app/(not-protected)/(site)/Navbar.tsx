import Image from 'next/image';
import Link from 'next/link';

import darkLogo from '@/assets/logos/dark-logo-wordmark.png';
import lightLogo from '@/assets/logos/light-logo-wordmark.png';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const navItems = [
  { label: 'home', href: '/' },
  { label: 'pricing', href: '/#pricing' },
  { label: 'docs', href: '/docs', external: true },
];

export default function Navbar() {
  return (
    <header className="top-0 z-50 flex border-b bg-background shadow-xs md:sticky">
      <div className="ml-4 flex items-center">
        <Link href="/">
          <div className="top-8 left-4 md:top-10 md:left-10">
            <Image
              src={darkLogo}
              unoptimized
              alt="logo"
              style={{ width: '120px', height: 'auto' }}
              className="hidden shrink-0 dark:block"
            />
            <Image
              src={lightLogo}
              unoptimized
              alt="logo"
              style={{ width: '120px', height: 'auto' }}
              className="shrink-0 dark:hidden"
            />
          </div>
        </Link>
      </div>
      <div className="ml-auto">
        <nav className="flex">
          <ul className="flex items-center divide-x divide-border">
            {navItems.map((item) => {
              const isExternal = item.external ?? false;
              const LinkComponent = isExternal ? 'a' : Link;
              return (
                <li key={`nav-item-${item.href}`} className="flex shrink-0">
                  <LinkComponent
                    className="group relative px-6 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    href={item.href}
                  >
                    {item.label}
                    <span className="absolute right-0 bottom-0 left-0 h-[1.5px] w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
                  </LinkComponent>
                </li>
              );
            })}
          </ul>
          <div className="flex border-l border-border">
            <ThemeSwitcher className="h-full w-11 rounded-none p-2" />
          </div>
        </nav>
      </div>
    </header>
  );
}
