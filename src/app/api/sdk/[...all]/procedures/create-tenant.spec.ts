import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbTenant, fakeDbTenantResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Create Tenant', () => {
  it('throw if the request is not valid', async () => {
    const request = createAuthorizedRequest('v1/tenants', {
      notWhatIs: 'expected',
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('create a new tenant', async () => {
    mockDb.tenant.create.mockResolvedValue(fakeDbTenant);
    mockDb.tenant.count.mockResolvedValue(0);

    const request = createAuthorizedRequest('v1/tenants', {
      name: fakeDbTenant.name,
      description: fakeDbTenant.description,
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toMatchObject(sillyClone(fakeDbTenantResponse));
  });
});
