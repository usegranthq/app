import { APIError } from 'better-call';

import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import { getApiErrorMessage } from '@/utils/error';

const deleteProject = createAuthEndpoint(
  'v1/projects/:id',
  {
    method: 'DELETE',
  },
  async (ctx) => {
    const { id } = ctx.params;

    const project = await db.project.findUnique({
      where: {
        id,
        userId: ctx.context.userId,
      },
    });

    if (!project) {
      return new APIError('NOT_FOUND', {
        message: 'Project not found',
      });
    }

    try {
      await db.project.delete({
        where: {
          id,
          userId: ctx.context.userId,
        },
      });

      return {};
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      return new APIError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default deleteProject;
