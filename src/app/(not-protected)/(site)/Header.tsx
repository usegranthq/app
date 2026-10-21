import Link from 'next/link';

import env from '@/env';
import { cn } from '@/shadcn/lib/utils';

import Logo from './Logo';
import { frame, LINKS, mono } from './styles';

export default function Header() {
  const isInviteOnly = Boolean(env.INVITE_TOKEN);

  return (
    <header className="sticky top-0 z-10 border-b border-white/8 bg-[rgba(10,10,10,.82)] backdrop-blur-md">
      <div className={cn(frame, 'flex h-16 items-center justify-between gap-6')}>
        <Link href="/" className="text-[#ededed]">
          <Logo />
        </Link>
        <nav className={cn(mono, 'flex items-center gap-7 text-[13px]')}>
          <a href={LINKS.DOCS} className="hidden text-[#a3a3a3] hover:text-(--accent) sm:inline">
            docs
          </a>
          <a href={LINKS.GITHUB} className="hidden text-[#a3a3a3] hover:text-(--accent) sm:inline">
            github
          </a>
          <a
            href={isInviteOnly ? LINKS.DOCS : '/login'}
            className="flex items-center gap-2 rounded-[2px] border border-white/18 px-3.5 py-2 text-[#ededed] hover:border-(--accent) hover:text-(--accent)"
          >
            Get started <span>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
