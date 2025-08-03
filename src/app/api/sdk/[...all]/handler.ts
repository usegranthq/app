import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { onError, ORPCError, ValidationError } from '@orpc/server';
import { z } from 'zod/v4';

import procedures from './procedures';
import rpcRouter from './rpc';

const handler = new OpenAPIHandler(rpcRouter.router(procedures), {
  interceptors: [
    onError((error) => {
      if (error instanceof ORPCError && error.code === 'BAD_REQUEST' && error.cause instanceof ValidationError) {
        // If you only use Zod you can safely cast to ZodIssue[]
        const zodError = new z.ZodError(error.data.issues as z.core.$ZodIssue[]);

        throw new ORPCError('INPUT_VALIDATION_FAILED', {
          status: 422,
          message: error.message,
          data: z.flattenError(zodError).fieldErrors,
          cause: error.cause,
        });
      }
    }),
  ],
});

export default handler;
