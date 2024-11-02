'use client';

import { useTheme } from 'next-themes';

import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function ThemeSwitcherDropdown() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
    </DropdownMenuContent>
  );
}
