import { getCustomer, getPlanDetails } from '@/data/user';

import Billing from './Billing';

export default async function BillingPage() {
  const plan = await getPlanDetails();
  const customer = await getCustomer();

  return <Billing plan={plan} showCustomerPortal={!!customer} />;
}
