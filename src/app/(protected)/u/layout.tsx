import { UserProvider } from '@/contexts/User';
import { PropsWithChildren } from 'react';

import { minimumDelay } from '@/utils/time';
import { getUser } from '@/dal/user';

export default async function UserLayout({ children }: PropsWithChildren) {
  const initialTime = Date.now();
  const user = await getUser();

  const currentTime = Date.now();
  await minimumDelay(2_000, initialTime, currentTime);

  return <UserProvider user={user}>{children}</UserProvider>;
}
