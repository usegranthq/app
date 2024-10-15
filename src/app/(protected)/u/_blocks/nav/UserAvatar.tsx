import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types/app.types';

interface UserAvatarProps {
  user: User;
  className?: string;
}

const salt = 'iZYWhkXRVPPIwRvI3FHiUSvzxbdZ5hsR';

async function hashStringWithSalt(str: string) {
  const encoder = new TextEncoder();

  // Combine the string and the salt
  const data = encoder.encode(str + salt);

  // Hash the combined result using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert the byte array to a hexadecimal string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function UserAvatar({ user, className }: UserAvatarProps) {
  const avatarFallback = user.email.charAt(0);
  const emailHash = await hashStringWithSalt(user.email);
  const avatarImage = `/avatar/?username=${emailHash}`;

  return (
    <Avatar className={cn('size-7', className)}>
      <AvatarImage src={avatarImage} />
      <AvatarFallback className="rounded-md uppercase">{avatarFallback}</AvatarFallback>
    </Avatar>
  );
}
