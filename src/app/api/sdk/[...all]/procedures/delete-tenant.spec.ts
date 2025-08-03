import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbTenant } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Delete Tenant', () => {
  it('throw if the tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('delete the tenant', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);

    const request = createAuthorizedRequest('v1/tenants/1');
    const response = await request.delete();
    expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
    expect(response.body).toBeNull();
  });
});
