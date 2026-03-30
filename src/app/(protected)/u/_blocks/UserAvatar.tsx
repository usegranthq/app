'use client';

import { useUser } from '@/contexts/User';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/ui/avatar';
import { cn } from '@/shadcn/lib/utils';

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
