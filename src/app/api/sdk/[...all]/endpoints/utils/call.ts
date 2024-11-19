import { createEndpointCreator, createMiddleware } from 'better-call';

interface AuthContext {
  userId: string;
}

export const optionsMiddleware = createMiddleware(async () => {
  /**
   * This will be passed on the instance of
   * the context. Used to infer the type here.
   */
  return {} as AuthContext;
});

export const createAuthEndpoint = createEndpointCreator({
  use: [optionsMiddleware],
});
