import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Create Provider', () => {
  it('throw if the request is not valid', async () => {
    const request = authorizedRequest('v1/providers', {
      body: {
        notWhatIs: 'expected',
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if max providers limit is reached', async () => {
    mockDb.provider.count.mockResolvedValue(PLANS.free.features.providers.limit);

    const request = authorizedRequest('v1/providers', {
      body: {
        name: 'test-provider',
        description: 'test-description',
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.MAX_PROVIDERS_LIMIT_REACHED);
  });

  it('create a new provider', async () => {
    mockDb.provider.create.mockResolvedValue(fakeDbProvider);

    const request = authorizedRequest('v1/providers', {
      body: {
        name: fakeDbProvider.name,
        description: fakeDbProvider.description,
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toEqual(sillyClone(fakeDbProvider));
  });
});
