import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Get Provider', () => {
  it('throw if the provider does not exist', async () => {
    const request = authorizedRequest('v1/providers/1', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('return the provider', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);

    const request = authorizedRequest('v1/providers/1', {
      method: 'GET',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(await response.json()).toEqual(sillyClone(fakeDbProvider));
  });
});
