import db from '@/lib/db';
import { createAuthEndpoint } from './utils/call';
import { createUrlId } from '@/utils/project';
import { getApiErrorMessage } from '@/utils/error';
import { getPlanByUserId } from '@/lib/auth';
import { projectSchema } from '@/schema';

import ERRORS, { SdkError } from './utils/errors';

const createProject = createAuthEndpoint(
  'v1/projects',
  {
    method: 'POST',
    body: projectSchema,
  },
  async (ctx) => {
    const { name, description } = ctx.body;

    const plan = await getPlanByUserId(ctx.context.userId);
    const projectsCount = await db.project.count({
      where: {
        userId: ctx.context.userId,
      },
    });

    if (projectsCount >= plan.projects) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_PROJECTS_LIMIT_REACHED);
    }

    try {
      const project = await db.project.create({
        data: {
          name,
          description,
          urlId: createUrlId(name),
          userId: ctx.context.userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          urlId: true,
        },
      });

      return project;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      throw new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createProject;
