import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import {
  fakeDbTenant,
  fakeDbTenantProvider,
  fakeDbTenantProviderPolicy,
  fakeDbTenantProviderPolicyResposne,
} from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: List Tenant Provider Policy', () => {
  it('throw if the tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('throw if the tenant provider does not exist', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_NOT_FOUND);
  });

  it('return the list of tenant provider policies', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findUnique.mockResolvedValue(fakeDbTenantProvider);
    mockDb.tenantProviderPolicy.findMany.mockResolvedValue([fakeDbTenantProviderPolicy]);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbTenantProviderPolicyResposne)]);
  });
});
