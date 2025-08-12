import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbTenant, fakeDbTenantProvider, fakeDbTenantProviderResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Create Tenant Provider', () => {
  it('throw if the request is not valid', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers', {
      notWhatIs: 'expected',
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if tenant does not exist', async () => {
    const request = createAuthorizedRequest('v1/tenants/1/providers', {
      url: 'https://example.com',
      audience: 'test-audience',
      earliestIssuanceTimeAllowed: 1,
      fingerprints: ['1234567890123456789012345678901234567890'],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_NOT_FOUND);
  });

  it('throw if plan does not allow more tenant providers', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.count.mockResolvedValue(PLANS.free.features.tenantProviders.limit);

    const request = createAuthorizedRequest('v1/tenants/1/providers', {
      url: 'https://example.com',
      audience: 'test-audience',
      earliestIssuanceTimeAllowed: 1,
      fingerprints: ['1234567890123456789012345678901234567890'],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.MAX_TENANT_PROVIDERS_LIMIT_REACHED);
  });

  it('throw if tenant provider already exists', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.count.mockResolvedValue(1);

    const request = createAuthorizedRequest('v1/tenants/1/providers', {
      url: 'https://example.com',
      audience: 'test-audience',
      earliestIssuanceTimeAllowed: 1,
      fingerprints: ['1234567890123456789012345678901234567890'],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CONFLICT);
    await expect(response.json()).resolves.toMatchObject(ERRORS.TENANT_PROVIDER_ALREADY_EXISTS);
  });

  it('create a tenant provider', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.count.mockResolvedValue(0);
    mockDb.tenantProvider.create.mockResolvedValue(fakeDbTenantProvider);

    const request = createAuthorizedRequest('v1/tenants/1/providers', {
      url: 'https://example.com',
      audience: 'test-audience',
      earliestIssuanceTimeAllowed: 1,
      fingerprints: ['1234567890123456789012345678901234567890'],
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toMatchObject(sillyClone(fakeDbTenantProviderResponse));
  });
});
