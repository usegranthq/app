import { NextRequest } from 'next/server';

import mockAuth from '@/lib/__mocks__/auth';

import { handleRequest } from '../../handle-request';
import { fakeDbApiKey } from './fake-data';

interface ModifiedRequestInit extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
}

export const createRequest = (path: string, requestInit: ModifiedRequestInit = {}) => {
  const body = requestInit.body ? JSON.stringify(requestInit.body) : undefined;

  const request = new NextRequest(`http://localhost:3000/api/sdk/${path}`, {
    ...requestInit,
    body,
    signal: undefined,
  });
  return request;
};

const authorizedRequest = (path: string, requestInit: ModifiedRequestInit = {}) => {
  mockAuth.api.verifyApiKey.mockResolvedValue({
    valid: true,
    key: fakeDbApiKey,
    error: null,
  });

  const headers = new Headers();
  headers.set('Authorization', 'Bearer test-key');
  headers.set('Content-Type', 'application/json');

  const request = createRequest(path, { ...requestInit, headers });
  return request;
};

function createAuthorizedRequest(path: string, body: Record<string, unknown> = {}) {
  return {
    async post() {
      const request = authorizedRequest(path, {
        body,
        method: 'POST',
      });
      return handleRequest(request);
    },
    get: () => {
      const request = authorizedRequest(path, {
        method: 'GET',
      });
      return handleRequest(request);
    },
    delete: () => {
      const request = authorizedRequest(path, {
        body,
        method: 'DELETE',
      });
      return handleRequest(request);
    },
  };
}

export default createAuthorizedRequest;
