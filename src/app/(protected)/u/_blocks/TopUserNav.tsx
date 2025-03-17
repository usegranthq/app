import { Button } from '@/shadcn/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/shadcn/components/ui/dropdown-menu';

import { UserAvatar } from './UserAvatar';
import UserNavDropdown from './UserNavDropdown';

export async function TopUserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>
      <UserNavDropdown forceMount />
    </DropdownMenu>
  );
}
