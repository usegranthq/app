import db from '@/lib/db';
import { toPaginatedResponse } from '@/utils/pagination';
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

export const getTenantProviders = async (
  tenantId: string,
  page: number,
  limit: number,
): Promise<PaginatedResponse<TenantProvider>> => {
  const session = await verifySession();

  const skip = (page - 1) * limit;
  const take = limit;

  const [providers, total] = await db.$transaction([
    db.tenantProvider.findMany({
      where: {
        tenantId,
        Tenant: {
          userId: session.user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    }),
    db.tenantProvider.count({
      where: {
        tenantId,
        Tenant: { userId: session.user.id },
      },
    }),
  ]);

  return toPaginatedResponse(providers, total, page, limit);
};
