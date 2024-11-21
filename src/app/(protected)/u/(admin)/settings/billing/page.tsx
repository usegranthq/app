import { getCustomer, getSubscription } from '@/data/user';

import Billing from './Billing';

export default async function BillingPage() {
  const customer = await getCustomer();
  const subscription = await getSubscription(customer);

  return <Billing customer={customer} subscription={subscription} />;
}
