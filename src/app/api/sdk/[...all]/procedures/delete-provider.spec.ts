import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';
import mockCustomDomain from '@/lib/__mocks__/domain';

import { fakeDbDomain, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Delete Provider', () => {
  it('throw if the provider does not exist', async () => {
    const request = createAuthorizedRequest('v1/providers/1');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('delete the provider', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([fakeDbDomain]);

    const request = createAuthorizedRequest('v1/providers/1');

    const response = await request.delete();
    expect(mockCustomDomain.remove).toHaveBeenCalledWith(fakeDbDomain.externalId);
    expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
    expect(response.body).toBeNull();
  });
});
