import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbProvider, fakeDbProviderResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: List Providers', () => {
  it('return the list of providers', async () => {
    mockDb.provider.findMany.mockResolvedValue([fakeDbProvider]);

    const request = createAuthorizedRequest('v1/providers');
    const response = await request.get();
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbProviderResponse)]);
  });
});
