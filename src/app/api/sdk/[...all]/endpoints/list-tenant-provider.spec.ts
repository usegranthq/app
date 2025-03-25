import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbTenant, fakeDbTenantProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: List Tenant Provider', () => {
  it('throw if the tenant does not exist', async () => {
    const request = authorizedRequest('v1/tenants/1/providers', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.TENANT_NOT_FOUND);
  });

  it('return the list of tenant providers', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);
    mockDb.tenantProvider.findMany.mockResolvedValue([fakeDbTenantProvider]);

    const request = authorizedRequest('v1/tenants/1/providers', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbTenantProvider)]);
  });
});
