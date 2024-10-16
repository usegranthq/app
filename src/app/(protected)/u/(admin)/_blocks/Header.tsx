import Link from 'next/link';
import { MenuIcon, VaultIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ActiveLink from '@/components/ActiveLink';

export default function Header() {
  return (
    <header className="sticky top-0 flex h-12 items-center gap-4 border-b bg-background">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <VaultIcon className="size-6" />
          <span className="sr-only">useGrant</span>
        </Link>
        <ActiveLink href="/u/projects" className="text-muted-foreground transition-colors hover:text-foreground">
          Projects
        </ActiveLink>
        <ActiveLink href="/u/settings" className="text-foreground transition-colors hover:text-foreground">
          Settings
        </ActiveLink>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <VaultIcon className="size-6" />
              <span className="sr-only">useGrant</span>
            </Link>
            <Link href="/u/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            <Link href="/u/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
