import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbTenant, fakeDbTenantProvider, fakeDbTenantProviderResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: List Tenant Provider', () => {
  it('throw if the tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('return the list of tenant providers', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findMany.mockResolvedValue([fakeDbTenantProvider]);

    const request = createAuthorizedRequest('v1/tenants/1/providers');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbTenantProviderResponse)]);
  });
});
