import db from '@/lib/db';
import { getApiErrorMessage } from '@/utils/error';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

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
      throw new SdkError('NOT_FOUND', ERRORS.PROJECT_NOT_FOUND);
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

      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default deleteProject;
