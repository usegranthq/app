import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbTenant, fakeDbTenantProvider, fakeDbTenantProviderPolicy } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Create Tenant Provider Policy', () => {
  it('throw if the request is not valid', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers/1_1/policies', {
      notWhatIs: 'expected',
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers/1.1/policies', {
      name: 'test-policy',
      description: 'test-description',
      audience: 'test-audience',
      conditions: [
        {
          key: 'sub',
          operator: 'stringLike',
          value: 'test-value',
        },
      ],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('throw if plan does not allow more tenant provider policies', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findUnique.mockResolvedValue(fakeDbTenantProvider);
    mockDb.tenantProviderPolicy.count.mockResolvedValue(PLANS.free.features.tenantProviderPolicies.limit);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1.1/policies', {
      name: 'test-policy',
      description: 'test-description',
      audience: 'test-audience',
      conditions: [
        {
          key: 'sub',
          operator: 'stringLike',
          value: 'test-value',
        },
      ],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED);
  });

  it('throw if tenant provider does not exist', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1.1/policies', {
      name: 'test-policy',
      description: 'test-description',
      audience: 'test-audience',
      conditions: [
        {
          key: 'sub',
          operator: 'stringLike',
          value: 'test-value',
        },
      ],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_NOT_FOUND);
  });

  it('throw if tenant provider policy already exists', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findUnique.mockResolvedValue(fakeDbTenantProvider);
    mockDb.tenantProviderPolicy.count.mockResolvedValue(1);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1.1/policies', {
      name: fakeDbTenantProviderPolicy.name,
      description: fakeDbTenantProviderPolicy.description,
      audience: fakeDbTenantProviderPolicy.audience,
      conditions: fakeDbTenantProviderPolicy.conditions,
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CONFLICT);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_POLICY_ALREADY_EXISTS);
  });

  it('create a tenant provider policy', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findUnique.mockResolvedValue(fakeDbTenantProvider);
    mockDb.tenantProviderPolicy.count.mockResolvedValue(0);
    mockDb.tenantProviderPolicy.create.mockResolvedValue(fakeDbTenantProviderPolicy);

    const request = createAuthorizedRequest('v1/tenants/1/providers/1.1/policies', {
      name: fakeDbTenantProviderPolicy.name,
      description: fakeDbTenantProviderPolicy.description,
      audience: fakeDbTenantProviderPolicy.audience,
      conditions: fakeDbTenantProviderPolicy.conditions,
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toMatchObject(sillyClone(fakeDbTenantProviderPolicy));
  });
});
