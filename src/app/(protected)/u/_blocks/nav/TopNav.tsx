import { User } from '@/types/app.types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { NavUserContent } from './NavUser';
import { UserAvatar } from './UserAvatar';

interface TapNavProps {
  user: User;
}

export async function TapNav({ user }: TapNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <NavUserContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
