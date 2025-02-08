'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type NavLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
  activeClassName?: string;
};

export default function NavLink(props: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  const className = cn(props.className, { [props.activeClassName ?? 'text-primary']: isActive });

  return <Link {...props} className={className} />;
}
