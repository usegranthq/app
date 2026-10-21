import 'server-only';
import db from '@/lib/db';
import { Client, Domain, Provider } from '@/types/app.types';
import { toPaginatedResponse } from '@/utils/pagination';

import { verifySession } from './_verifySession';

export const getProviders = async (): Promise<Provider[]> => {
  const session = await verifySession();

  return await db.provider.findMany({
    where: {
      userId: session.user.id,
    },
  });
};

export const getProvider = async (providerId: string): Promise<Provider | null> => {
  await verifySession();

  try {
    const provider = await db.provider.findUnique({
      where: { id: providerId },
    });

    return provider;
  } catch {}

  return null;
};

export const getDomains = async (providerId: string): Promise<Domain[]> => {
  await verifySession();

  return await db.domain.findMany({
    where: {
      providerId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getClients = async (
  providerId: string,
  page: number,
  limit: number,
): Promise<PaginatedResponse<Client>> => {
  const session = await verifySession();

  const skip = (page - 1) * limit;
  const take = limit;

  const [clients, total] = await db.$transaction([
    db.client.findMany({
      where: {
        providerId,
        Provider: {
          userId: session.user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    }),
    db.client.count({
      where: {
        providerId,
        Provider: {
          userId: session.user.id,
        },
      },
    }),
  ]);

  return toPaginatedResponse(clients, total, page, limit);
};

export interface SigningKey {
  id: string;
  kid: string;
  createdAt: Date;
}

export const getSigningKeys = async (providerId: string): Promise<SigningKey[]> => {
  await verifySession();

  const keys = await db.jwks.findMany({
    where: { providerId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      kid: true,
      createdAt: true,
    },
  });

  return keys;
};
