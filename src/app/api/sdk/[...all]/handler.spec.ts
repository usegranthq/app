import { describe, expect, it } from 'vitest';

import mockAuth from '@/lib/__mocks__/auth';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbApiKey } from './procedures/test-utils/fake-data';
import { createRequest } from './procedures/test-utils/request';
import { handleRequest } from './route';

describe('SDK: Router', () => {
  it('return 401 if the request doesnt have an api key', async () => {
    const request = createRequest('v1/providers/1/domains');
    const response = await handleRequest(request);
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
  });

  it('return 404 if the request is not found', async () => {
    mockAuth.api.verifyApiKey.mockResolvedValue({
      valid: true,
      key: fakeDbApiKey,
      error: null,
    });

    const request = createRequest('invalid-path');
    request.headers.set('Authorization', 'Bearer test-key');
    const response = await handleRequest(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
  });

  it('return 401 if the api key doesnt match the given path', async () => {
    mockAuth.api.verifyApiKey.mockResolvedValue({
      valid: true,
      key: null,
      error: {
        code: 'KEY_NOT_FOUND',
        message: 'Key not found',
      },
    });

    const request = createRequest('v1/providers/1/domains');
    request.headers.set('Authorization', 'Bearer test-key');
    const response = await handleRequest(request);
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
  });

  it('return 429 if the api key is rate limited', async () => {
    mockAuth.api.verifyApiKey.mockResolvedValue({
      valid: true,
      key: null,
      error: {
        code: 'RATE_LIMITED',
        message: 'Rate limited',
      },
    });

    const request = createRequest('v1/providers/1/domains');
    request.headers.set('Authorization', 'Bearer test-key');
    const response = await handleRequest(request);
    expect(response.status).toBe(STATUS_CODES.TOO_MANY_REQUESTS);
    expect(response.headers.get('Retry-After')).toBe(null);
  });
});
