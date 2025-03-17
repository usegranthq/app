import { PropsWithChildren } from 'react';

import { getUser } from '@/data/user';
import LoadingProgress from '@/components/NavProgress';
import { UserProvider } from '@/contexts/User';

export default async function UserLayout({ children }: PropsWithChildren) {
  const user = await getUser();

  return (
    <>
      <LoadingProgress>
        <UserProvider user={user}>{children}</UserProvider>
      </LoadingProgress>
    </>
  );
}
