import { KanbanIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';

import NavLink from '@/components/NavLink';
import { Button } from '@/shadcn/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shadcn/components/ui/sheet';

export default function Header() {
  return (
    <header className="flex h-fit items-center gap-4">
      <Link href="/u/providers" className="flex items-center gap-2">
        <KanbanIcon className="size-6" />
        <span className="sr-only">useGrant</span>
      </Link>
      <nav className="mr-4 ml-auto hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <NavLink href="/u/providers" className="text-muted-foreground transition-colors hover:text-foreground">
          Providers
        </NavLink>
        <NavLink href="/u/tenants" className="text-muted-foreground transition-colors hover:text-foreground">
          Tenants
        </NavLink>
        <a href="/docs" target="_blank" className="text-muted-foreground transition-colors hover:text-foreground">
          Docs
        </a>
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
            <Link href="/u/providers" className="flex items-center gap-2">
              <KanbanIcon className="size-6" />
              <span className="sr-only">useGrant</span>
            </Link>
            <NavLink href="/u/providers" className="text-muted-foreground hover:text-foreground">
              Providers
            </NavLink>
            <NavLink href="/u/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
