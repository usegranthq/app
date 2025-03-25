import { describe, expect, it } from 'vitest';

import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbTenant } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: List Tenants', () => {
  it('return the list of tenants', async () => {
    mockDb.tenant.findMany.mockResolvedValue([fakeDbTenant]);

    const request = authorizedRequest('v1/tenants', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbTenant)]);
  });
});
