'use client';

import { useRouter } from 'next/navigation';

import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import clientApi from '@/lib/api/client';

export function LogoutDropItem() {
  const router = useRouter();

  const handleLogout = async () => {
    await clientApi.post('/v1/u/logout');
    router.push('/login');
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
