import { APIError } from 'better-call';

import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import { getApiErrorMessage } from '@/utils/error';

import ERRORS from './utils/errors';

const deleteClient = createAuthEndpoint(
  'v1/projects/:projectId/clients/:clientId',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { projectId, clientId } = ctx.params;

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        projectId,
      },
    });

    if (!client) {
      throw new APIError('NOT_FOUND', ERRORS.CLIENT_NOT_FOUND);
    }

    try {
      await db.client.delete({
        where: {
          id: clientId,
          projectId,
        },
      });

      return {};
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw new APIError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default deleteClient;
