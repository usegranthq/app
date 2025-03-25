import { describe, expect, it } from 'vitest';

import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: List Providers', () => {
  it('return the list of providers', async () => {
    mockDb.provider.findMany.mockResolvedValue([fakeDbProvider]);

    const request = authorizedRequest('v1/providers', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual([sillyClone(fakeDbProvider)]);
  });
});
