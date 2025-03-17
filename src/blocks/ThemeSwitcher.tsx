import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from '@/shadcn/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/shadcn/components/ui/dropdown-menu';
import { cn } from '@/shadcn/lib/utils';

import { ThemeSwitcherDropdown } from './ThemeSwitcherDropdown';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('p size-8', className)}>
          <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <ThemeSwitcherDropdown />
    </DropdownMenu>
  );
}
