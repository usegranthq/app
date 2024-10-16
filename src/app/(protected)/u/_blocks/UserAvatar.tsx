'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/User';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  className?: string;
}

const salt = 'iZYWhkXRVPPIwRvI3FHiUSvzxbdZ5hsR';

export function UserAvatar({ className }: UserAvatarProps) {
  const user = useUser();

  const avatarFallback = user.email.charAt(0);
  const avatarImage = `/avatar/?username=${salt}`;

  return (
    <Avatar className={cn('size-7', className)}>
      <AvatarImage src={avatarImage} />
      <AvatarFallback className="rounded-md uppercase">{avatarFallback}</AvatarFallback>
    </Avatar>
  );
}
