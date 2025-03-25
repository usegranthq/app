import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';
import mockVercel from '@/lib/__mocks__/vercel';

import handler from '../handler';
import { fakeDbDomain, fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Delete Provider', () => {
  it('throw if the provider does not exist', async () => {
    const request = authorizedRequest('v1/providers/1', {
      method: 'DELETE',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('delete the provider', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([fakeDbDomain]);

    const request = authorizedRequest('v1/providers/1', {
      method: 'DELETE',
    });

    const response = await handler(request);
    expect(mockVercel.domains.delete).toHaveBeenCalledWith(fakeDbDomain.domain);
    expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
    expect(response.body).toBeNull();
  });
});
