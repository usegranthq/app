import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbClient, fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: List Clients', () => {
  it('throw if the provider does not exist', async () => {
    const request = authorizedRequest('v1/providers/1/clients', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('return the list of clients', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findMany.mockResolvedValue([fakeDbClient]);

    const request = authorizedRequest('v1/providers/1/clients', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbClient)]);
  });
});
