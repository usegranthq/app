import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbTenant } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Create Tenant', () => {
  it('should throw if the request is not valid', async () => {
    const request = authorizedRequest('v1/tenants', {
      body: {
        notWhatIs: 'expected',
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('should throw if max tenants limit is reached', async () => {
    mockDb.tenant.count.mockResolvedValue(PLANS.free.features.tenants.limit);

    const request = authorizedRequest('v1/tenants', {
      body: {
        name: 'test-tenant',
        description: 'test-description',
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.MAX_TENANTS_LIMIT_REACHED);
  });

  it('should create a new tenant', async () => {
    mockDb.tenant.create.mockResolvedValue(fakeDbTenant);
    mockDb.tenant.count.mockResolvedValue(0);

    const request = authorizedRequest('v1/tenants', {
      body: {
        name: fakeDbTenant.name,
        description: fakeDbTenant.description,
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toEqual(sillyClone(fakeDbTenant));
  });
});
