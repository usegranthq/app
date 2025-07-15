import { getUser } from '@/data/user';

import ProfileForm from './ProfileForm';

export default async function Settings() {
  const user = await getUser();

  return <ProfileForm user={user} />;
}
