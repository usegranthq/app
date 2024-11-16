import 'server-only';

import { Project, Client, Domain } from '@/types/app.types';
import db from '@/lib/db';
import { defaultJwk } from '@/utils/jwt';

import { verifySession } from './_verifySession';

export const getProjects = async (): Promise<Project[]> => {
  const session = await verifySession();

  return await db.project.findMany({
    where: {
      userId: session.user.id,
    },
  });
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  await verifySession();

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    return project;
  } catch {}

  return null;
};

export const getDomains = async (projectId: string): Promise<Domain[]> => {
  await verifySession();

  return await db.domain.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getClients = async (projectId: string): Promise<Client[]> => {
  await verifySession();

  return await db.client.findMany({
    where: {
      projectId,
    },
  });
};

export interface SigningKey {
  id: string;
  kid: string;
  isDefault: boolean;
  createdAt: Date | null;
}

export const getSigningKeys = async (projectId: string): Promise<SigningKey[]> => {
  await verifySession();

  const keys = await db.jwks.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      kid: true,
      createdAt: true,
    },
  });
  const allKeys = [...keys, { ...defaultJwk, id: defaultJwk.kid, createdAt: null }];

  return allKeys.map((key) => ({
    ...key,
    isDefault: key.kid === defaultJwk.kid,
    createdAt: key.createdAt ?? null,
  }));
};
