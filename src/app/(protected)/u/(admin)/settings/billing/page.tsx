import { getPlanDetails } from '@/data/user';

import Billing from './Billing';

export default async function BillingPage() {
  const plan = await getPlanDetails();

  return <Billing plan={plan} />;
}
