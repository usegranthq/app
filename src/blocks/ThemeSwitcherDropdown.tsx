'use client';

import { useTheme } from 'next-themes';

import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function ThemeSwitcherDropdown() {
  const { setTheme, theme: currentTheme } = useTheme();

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
  const changeTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === currentTheme) return;

    if (!document.startViewTransition) return setTheme(theme);
    document.startViewTransition(() => setTheme(theme));
  };

  return (
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => changeTheme('light')}>Light</DropdownMenuItem>
      <DropdownMenuItem onClick={() => changeTheme('dark')}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={() => changeTheme('system')}>System</DropdownMenuItem>
    </DropdownMenuContent>
  );
}
