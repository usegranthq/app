import * as jose from 'jose';
import { describe, expect, it, vi } from 'vitest';

import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';

import handler from '../handler';
import { fakeDbClient, fakeDbProvider, fakeDbProviderWithDomain } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';
import { mockProPlanSubscription } from './test-utils/subscription';

describe('SDK: Create Access Token', () => {
  it('should throw if the request is not valid', async () => {
    const request = authorizedRequest('v1/providers/1/clients/1_1/tokens', {
      body: {
        expiresIn: '1000', // should be a number
        useJwtType: true,
        audienceAsArray: true,
        forceDefaultDomain: true,
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('should throw if provider is not found', async () => {
    mockDb.provider.findUnique.mockResolvedValue(null);
    const request = authorizedRequest('v1/providers/1/clients/1_1/tokens', {
      body: {
        expiresIn: 1000,
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('should throw if client is not found', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findUnique.mockResolvedValue(null);
    const request = authorizedRequest('v1/providers/1/clients/1_1/tokens', {
      body: {
        expiresIn: 1000,
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.CLIENT_NOT_FOUND);
  });

  it('should create a new access token using default jwt', async () => {
    vi.useFakeTimers();

    const fixedDate = new Date('2025-03-25T12:00:00Z');
    vi.setSystemTime(fixedDate);

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProviderWithDomain);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);
    const request = authorizedRequest('v1/providers/1/clients/1_1/tokens', {
      body: {
        expiresIn: 1020,
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    const body = await response.json();
    expect(body.accessToken).toBeDefined();
    expect(body.type).toBe('Bearer');
    expect(body.expiresAt).toBeDefined();

    const claims = jose.decodeJwt(body.accessToken);
    expect(claims.iss).toBe(`https://${fakeDbProviderWithDomain.urlId}.auth.usegrant.dev`);
    expect(claims.aud).toBe(fakeDbClient.audience);
    expect(claims.sub).toBe(fakeDbClient.subject);
    expect(claims.exp).toBe(Date.now() / 1000 + 1020);
    vi.useRealTimers();
  });

  it('should create a new access token using custom domain', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProviderWithDomain);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);

    const request = authorizedRequest('v1/providers/1/clients/1_1/tokens', {
      body: {
        expiresIn: 1000,
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    const body = await response.json();
    expect(body.accessToken).toBeDefined();
    expect(body.type).toBe('Bearer');
    expect(body.expiresAt).toBeDefined();

    const claims = jose.decodeJwt(body.accessToken);
    expect(claims.iss).toBe(`https://${fakeDbProviderWithDomain.Domain[0].domain}`);
    expect(claims.aud).toBe(fakeDbClient.audience);
    expect(claims.sub).toBe(fakeDbClient.subject);
    expect(claims.exp).toBeGreaterThan(Date.now() / 1000);
  });
});
