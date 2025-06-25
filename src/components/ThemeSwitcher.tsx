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
          <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <ThemeSwitcherDropdown />
    </DropdownMenu>
  );
}
