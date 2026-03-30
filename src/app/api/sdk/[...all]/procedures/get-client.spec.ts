import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbClient, fakeDbClientResponse, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Get Client', () => {
  it('throw if the provider does not exist', async () => {
    const request = createAuthorizedRequest('v1/providers/1/clients/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw if the client does not exist', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    const request = createAuthorizedRequest('v1/providers/1/clients/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.CLIENT_NOT_FOUND);
  });

  it('return the client', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);

    const request = createAuthorizedRequest('v1/providers/1/clients/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual(sillyClone(fakeDbClientResponse));
  });
});
