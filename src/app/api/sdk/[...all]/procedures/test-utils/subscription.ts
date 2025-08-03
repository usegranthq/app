import mockDb from '@/lib/__mocks__/db';

export const mockProPlanSubscription = () => {
  mockDb.customer.findUnique.mockResolvedValue({
    id: '1',
    userId: '1',
    customerRefId: '1',
  });

  mockDb.subscription.findFirst.mockResolvedValue({
    id: '1',
    customerId: '1',
    productId: 'prod_pro_xxxx',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    subscriptionRefId: '1',
  });
};
