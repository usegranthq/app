import { getCustomer, getPlanDetails } from '@/data/user';

import Billing from './Billing';

export default async function BillingPage() {
  const customer = await getCustomer();
  const plan = await getPlanDetails();

  return <Billing customer={customer} plan={plan} />;
}
