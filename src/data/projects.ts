import 'server-only';

import { Project, Client } from '@/types/app.types';
import db from '@/lib/db';

import { verifySession } from './_verifySession';

export const getProjects = async (): Promise<Project[]> => {
  const session = await verifySession();

  return await db.project.findMany({
    where: {
      accountId: session.account.id,
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
