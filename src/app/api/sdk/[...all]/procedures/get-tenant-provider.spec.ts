import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbTenant, fakeDbTenantProvider, fakeDbTenantProviderResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Get Tenant Provider', () => {
  it('throw if the tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('throw if the tenant provider does not exist', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findFirst.mockResolvedValue(null);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_NOT_FOUND);
  });

  it('return the tenant provider', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findFirst.mockResolvedValue(fakeDbTenantProvider);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual(sillyClone(fakeDbTenantProviderResponse));
  });
});
