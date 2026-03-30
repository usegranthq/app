import { PropsWithChildren } from 'react';

import LoadingProgress from '@/components/NavProgress';
import { UserProvider } from '@/contexts/User';
import { getUser } from '@/data/user';

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
