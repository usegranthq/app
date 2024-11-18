import { APIError } from 'better-call';

import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';

const getProject = createAuthEndpoint(
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
      select: {
        id: true,
        name: true,
        description: true,
        urlId: true,
      },
    });

    if (!project) {
      return new APIError('NOT_FOUND', {
        message: 'Project not found',
      });
    }

    return project;
  },
);

export default getProject;
