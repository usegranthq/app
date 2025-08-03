import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbDomain, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Delete Domain', () => {
  it('throw if the provider does not exist', async () => {
    const request = createAuthorizedRequest('v1/providers/1/domains/1.d');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw if the domain does not exist', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    const request = createAuthorizedRequest('v1/providers/1/domains/1.d');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.DOMAIN_NOT_FOUND);
  });

  it('delete the domain', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findUnique.mockResolvedValue(fakeDbDomain);

    const request = createAuthorizedRequest('v1/providers/1/domains/1.d');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
  });
});
