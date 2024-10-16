'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';

import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

import { logout } from '@/actions';

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
    <DropdownMenuItem onClick={handleLogout} className="gap-2">
      <LogOutIcon className="text-muted-foreground" />
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
