import { APIError } from 'better-call';

import db from '@/lib/db';
import { projectSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import { createUrlId } from '@/utils/project';
import { getApiErrorMessage } from '@/utils/error';

const createProject = createAuthEndpoint(
  'v1/projects',
  {
    method: 'POST',
    body: projectSchema,
  },
  async (ctx) => {
    const { name, description } = ctx.body;

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

      return new APIError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default createProject;
