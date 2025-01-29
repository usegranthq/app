import db from '@/lib/db';
import { Tenant, TenantProvider } from '@/types/app.types';

import { verifySession } from './_verifySession';

export const getTenants = async (): Promise<Tenant[]> => {
  const session = await verifySession();

  return await db.tenant.findMany({
    where: {
      userId: session.user.id,
    },
  });
};

export const getTenant = async (tenantId: string): Promise<Tenant | null> => {
  const session = await verifySession();

  return await db.tenant.findUnique({
    where: {
      id: tenantId,
      userId: session.user.id,
    },
  });
};

export const getTenantProviders = async (tenantId: string): Promise<TenantProvider[]> => {
  const session = await verifySession();

  return await db.tenantProvider.findMany({
    where: {
      tenantId,
      Tenant: {
        userId: session.user.id,
      },
    },
  });
};
