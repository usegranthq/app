import { describe, expect, it } from 'vitest';

import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbTenant, fakeDbTenantResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: List Tenants', () => {
  it('return the list of tenants', async () => {
    mockDb.tenant.findMany.mockResolvedValue([fakeDbTenant]);

    const request = createAuthorizedRequest('v1/tenants');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbTenantResponse)]);
  });
});
