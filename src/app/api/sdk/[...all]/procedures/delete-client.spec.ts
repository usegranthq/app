import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbClient, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Delete Client', () => {
  it('throw if the provider does not exist', async () => {
    const request = createAuthorizedRequest('v1/providers/1/clients/1');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw if the client does not exist', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    const request = createAuthorizedRequest('v1/providers/1/clients/1');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.CLIENT_NOT_FOUND);
  });

  it('delete the client', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);

    const request = createAuthorizedRequest('v1/providers/1/clients/1');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
  });
});
