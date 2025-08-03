import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import { fakeDbProvider, fakeDbProviderResponse } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Create Provider', () => {
  it('throw if the request is not valid', async () => {
    const request = createAuthorizedRequest('v1/providers', {
      notWhatIs: 'expected',
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if max providers limit is reached', async () => {
    mockDb.provider.count.mockResolvedValue(PLANS.free.features.providers.limit);

    const request = createAuthorizedRequest('v1/providers', {
      name: 'test-provider',
      description: 'test-description',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.MAX_PROVIDERS_LIMIT_REACHED);
  });

  it('create a new provider', async () => {
    mockDb.provider.create.mockResolvedValue(fakeDbProvider);

    const request = createAuthorizedRequest('v1/providers', {
      name: fakeDbProvider.name,
      description: fakeDbProvider.description,
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toEqual(sillyClone(fakeDbProviderResponse));
  });
});
