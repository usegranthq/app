import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbTenant } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Get Tenant', () => {
  it('throw if the tenant does not exist', async () => {
    const request = authorizedRequest('v1/tenants/1', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.TENANT_NOT_FOUND);
  });

  it('return the tenant', async () => {
    mockDb.tenant.findUnique.mockResolvedValue(fakeDbTenant);

    const request = authorizedRequest('v1/tenants/1', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual(sillyClone(fakeDbTenant));
  });
});
