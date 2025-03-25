import { describe, expect, it } from 'vitest';

import { PLANS } from '@/utils/billing';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbClient, fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';

describe('SDK: Create Client', () => {
  it('throw if the request is not valid', async () => {
    const request = authorizedRequest('v1/providers/1/clients', {
      body: {
        notWhatIs: 'expected',
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if provider is not found', async () => {
    mockDb.provider.findUnique.mockResolvedValue(null);
    const request = authorizedRequest('v1/providers/1/clients', {
      body: {
        name: 'test-client',
        audience: 'test-audience',
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw forbidden if max clients limit is reached', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.count.mockResolvedValue(PLANS.free.features.providerClients.limit);

    const request = authorizedRequest('v1/providers/1/clients', {
      body: {
        name: 'test-client',
        audience: 'test-audience',
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.MAX_CLIENTS_LIMIT_REACHED);
  });

  it('throw if client already exists', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findFirst.mockResolvedValue(fakeDbClient);

    const request = authorizedRequest('v1/providers/1/clients', {
      body: {
        name: fakeDbClient.name,
        audience: fakeDbClient.audience,
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.CLIENT_ALREADY_EXISTS);
  });

  it('create a new client', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findFirst.mockResolvedValue(null);
    mockDb.client.create.mockResolvedValue(fakeDbClient);

    const request = authorizedRequest('v1/providers/1/clients', {
      body: {
        name: 'test-client',
        audience: 'test-audience',
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toEqual(sillyClone(fakeDbClient));
  });
});
