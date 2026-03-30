import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import {
  fakeDbTenant,
  fakeDbTenantProvider,
  fakeDbTenantProviderPolicy,
  fakeDbTenantProviderPolicyResposne,
} from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Get Tenant Provider Policy', () => {
  it('throw if the tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('throw if the tenant provider does not exist', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_NOT_FOUND);
  });

  it('throw if the tenant provider policy does not exist', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findUnique.mockResolvedValue(fakeDbTenantProvider);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND);
  });

  it('return the policy', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findUnique.mockResolvedValue(fakeDbTenantProvider);
    mockDb.tenantProviderPolicy.findUnique.mockResolvedValue(fakeDbTenantProviderPolicy);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1/policies/1');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual(sillyClone(fakeDbTenantProviderPolicyResposne));
  });
});
