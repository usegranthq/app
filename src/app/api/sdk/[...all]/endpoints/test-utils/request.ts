import mockAuth from '@/lib/__mocks__/auth';

import { fakeDbApiKey } from './fake-data';

interface ModifiedRequestInit extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
}

const createRequest = (path: string, requestInit: ModifiedRequestInit = {}) => {
  const body = requestInit.body ? JSON.stringify(requestInit.body) : undefined;

  const request = new Request(`http://localhost:3000/${path}`, {
    ...requestInit,
    body,
  });
  return request;
};

export const objToRequestBody = (obj: unknown): string => {
  return JSON.stringify(obj);
};

export const authorizedRequest = (path: string, requestInit: ModifiedRequestInit = {}) => {
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

export default createRequest;
