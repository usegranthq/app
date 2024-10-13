'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

import { logout } from './action';

export function LogoutDropItem() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
