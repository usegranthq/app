'use client';

import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

type ActiveLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
  activeClassName?: string;
};

export default function ActiveLink(props: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  const className = cn(props.className, { [props.activeClassName ?? 'text-primary']: isActive });

  return <Link {...props} className={className} />;
}
