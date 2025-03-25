import { describe, expect, it } from 'vitest';

import { STATUS_CODES } from '@/utils/rest';
import mockAuth from '@/lib/__mocks__/auth';

import { fakeDbApiKey } from './endpoints/test-utils/fake-data';
import createRequest from './endpoints/test-utils/request';
import { handler } from './route';

describe('SDK: Router', () => {
  it('should return 401 if the request doesnt have an api key', async () => {
    const request = createRequest('sdk/v1/providers/1/domains');
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
  });

  it('should return 404 if the request is not found', async () => {
    mockAuth.api.verifyApiKey.mockResolvedValue({
      valid: true,
      key: fakeDbApiKey,
      error: null,
    });

    const request = createRequest('invalid-path');
    request.headers.set('Authorization', 'Bearer test-key');
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
  });

  it('should return 401 if the api key doesnt match the given path', async () => {
    mockAuth.api.verifyApiKey.mockResolvedValue({
      valid: true,
      key: null,
      error: {
        code: 'KEY_NOT_FOUND',
        message: 'Key not found',
      },
    });

    const request = createRequest('sdk/v1/providers/1/domains');
    request.headers.set('Authorization', 'Bearer test-key');
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
  });

  it('should return 429 if the api key is rate limited', async () => {
    mockAuth.api.verifyApiKey.mockResolvedValue({
      valid: true,
      key: null,
      error: {
        code: 'RATE_LIMITED',
        message: 'Rate limited',
        details: {
          tryAgainIn: 60,
        },
      },
    });

    const request = createRequest('sdk/v1/providers/1/domains');
    request.headers.set('Authorization', 'Bearer test-key');
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.TOO_MANY_REQUESTS);
    expect(response.headers.get('Retry-After')).toBe('60');
  });
});
