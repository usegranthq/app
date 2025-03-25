import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbClient, fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Delete Client', () => {
  it('should throw if the provider does not exist', async () => {
    const request = authorizedRequest('v1/providers/1/clients/1', {
      method: 'DELETE',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('should throw if the client does not exist', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    const request = authorizedRequest('v1/providers/1/clients/1', {
      method: 'DELETE',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.CLIENT_NOT_FOUND);
  });

  it('should delete the client', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);

    const request = authorizedRequest('v1/providers/1/clients/1', {
      method: 'DELETE',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
  });
});
