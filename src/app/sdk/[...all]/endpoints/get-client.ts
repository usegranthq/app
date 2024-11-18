import { APIError } from 'better-call';

import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';

const getClient = createAuthEndpoint(
  'v1/projects/:projectId/clients/:clientId',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { projectId, clientId } = ctx.params;

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        projectId,
      },
      select: {
        id: true,
        name: true,
        audience: true,
      },
    });

    if (!client) {
      return new APIError('NOT_FOUND', {
        message: 'Client not found',
      });
    }

    return client;
  },
);

export default getClient;
