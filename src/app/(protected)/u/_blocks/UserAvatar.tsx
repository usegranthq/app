'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/User';

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const user = useUser();

  return (
    <Avatar className={cn('size-7', className)}>
      <AvatarImage src={`/avatar/?username=${user.id}`} />
      <AvatarFallback className="rounded-md uppercase">{user.email.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
