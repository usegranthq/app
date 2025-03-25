import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbTenant, fakeDbTenantProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Create Tenant Provider', () => {
  it('should throw if the request is not valid', async () => {
    const request = authorizedRequest('v1/tenants/1/providers', {
      body: {
        notWhatIs: 'expected',
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('should throw if tenant does not exist', async () => {
    const request = authorizedRequest('v1/tenants/1/providers', {
      body: {
        url: 'https://example.com',
        audience: 'test-audience',
        earliestIssuanceTimeAllowed: 1,
        fingerprints: ['1234567890123456789012345678901234567890'],
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.TENANT_NOT_FOUND);
  });

  it('should throw if plan does not allow more tenant providers', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.count.mockResolvedValue(PLANS.free.features.tenantProviders.limit);

    const request = authorizedRequest('v1/tenants/1/providers', {
      body: {
        url: 'https://example.com',
        audience: 'test-audience',
        earliestIssuanceTimeAllowed: 1,
        fingerprints: ['1234567890123456789012345678901234567890'],
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.MAX_TENANT_PROVIDERS_LIMIT_REACHED);
  });

  it('should throw if tenant provider already exists', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.count.mockResolvedValue(1);

    const request = authorizedRequest('v1/tenants/1/providers', {
      body: {
        url: 'https://example.com',
        audience: 'test-audience',
        earliestIssuanceTimeAllowed: 1,
        fingerprints: ['1234567890123456789012345678901234567890'],
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CONFLICT);
    await expect(response.json()).resolves.toEqual(ERRORS.TENANT_PROVIDER_ALREADY_EXISTS);
  });

  it('should create a tenant provider', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.count.mockResolvedValue(0);
    mockDb.tenantProvider.create.mockResolvedValue(fakeDbTenantProvider);

    const request = authorizedRequest('v1/tenants/1/providers', {
      body: {
        url: 'https://example.com',
        audience: 'test-audience',
        earliestIssuanceTimeAllowed: 1,
        fingerprints: ['1234567890123456789012345678901234567890'],
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toEqual(sillyClone(fakeDbTenantProvider));
  });
});
