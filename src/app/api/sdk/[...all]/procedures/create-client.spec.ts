import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbClient, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Create Client', () => {
  it('throw if the request is not valid', async () => {
    const request = createAuthorizedRequest('v1/providers/1/clients', {
      notWhatIs: 'expected',
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if provider is not found', async () => {
    mockDb.provider.findUnique.mockResolvedValue(null);
    const request = createAuthorizedRequest('v1/providers/1/clients', {
      name: 'test-client',
      audience: 'test-audience',
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw forbidden if max clients limit is reached', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.count.mockResolvedValue(PLANS.free.features.providerClients.limit);

    const request = createAuthorizedRequest('v1/providers/1/clients', {
      name: 'test-client',
      audience: 'test-audience',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.MAX_CLIENTS_LIMIT_REACHED);
  });

  it('throw if client already exists', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findFirst.mockResolvedValue(fakeDbClient);

    const request = createAuthorizedRequest('v1/providers/1/clients', {
      name: fakeDbClient.name,
      audience: fakeDbClient.audience,
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CONFLICT);
    await expect(response.json()).resolves.toMatchObject(ERRORS.CLIENT_ALREADY_EXISTS);
  });

  it('create a new client', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findFirst.mockResolvedValue(null);
    mockDb.client.create.mockResolvedValue(fakeDbClient);

    const request = createAuthorizedRequest('v1/providers/1/clients', {
      name: 'test-client',
      audience: 'test-audience',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toMatchObject(sillyClone(fakeDbClient));
  });
});
