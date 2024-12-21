import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const getProject = createAuthEndpoint(
  'v1/projects/:id',
  {
    method: 'GET',
  },
  async (ctx) => {
    const { id } = ctx.params;

    const project = await db.project.findUnique({
      where: {
        id,
        userId: ctx.context.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        urlId: true,
      },
    });

    if (!project) {
      throw new SdkError('NOT_FOUND', ERRORS.PROJECT_NOT_FOUND);
    }

    return project;
  },
);

export default getProject;
