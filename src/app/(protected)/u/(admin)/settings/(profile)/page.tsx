import { getSocialAccounts, getUser } from '@/data/user';

import ConnectedAccounts from './ConnectedAccounts';
import ProfileForm from './ProfileForm';

export default async function Settings() {
  const userPromise = getUser();
  const connectedAccountsPromise = getSocialAccounts();

  const [user, connectedAccounts] = await Promise.all([userPromise, connectedAccountsPromise]);

  return (
    <div className="grid gap-10">
      <ProfileForm user={user} />
      <ConnectedAccounts accounts={connectedAccounts} />
    </div>
  );
}
