import api from '@/lib/api';
import { User } from '@/types/app.types';
import { UserProvider } from '@/contexts/User';

import { minimumDelay } from '@/utils/time';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const initialTime = Date.now();
  const user = await api.get<User>('v1/u/me').json();

  const currentTime = Date.now();
  await minimumDelay(2_000, initialTime, currentTime);

  return <UserProvider user={user}>{children}</UserProvider>;
}
