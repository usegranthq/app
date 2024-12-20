import { APIError } from 'better-call';

import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS from './utils/errors';

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
      throw new APIError('NOT_FOUND', ERRORS.CLIENT_NOT_FOUND);
    }

    return client;
  },
);

export default getClient;
