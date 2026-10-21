import * as jose from 'jose';
import { describe, expect, it, vi } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import ERRORS from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';

import {
  fakeDbClient,
  fakeDbProvider,
  fakeDbProviderWithDomain,
  fakeDbProviderWithoutDomain,
} from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';

describe('SDK: Create Access Token', () => {
  it('throw if the request is not valid', async () => {
    const request = createAuthorizedRequest('v1/providers/1/clients/1_1/tokens', {
      expiresIn: '1000', // should be a number
      useJwtType: true,
      audienceAsArray: true,
      forceDefaultDomain: true,
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('throw if provider is not found', async () => {
    mockDb.provider.findUnique.mockResolvedValue(null);
    const request = createAuthorizedRequest('v1/providers/1/clients/1_1/tokens', {
      expiresIn: 1000,
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw if client is not found', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.client.findUnique.mockResolvedValue(null);
    const request = createAuthorizedRequest('v1/providers/1/clients/1_1/tokens', {
      expiresIn: 1000,
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.CLIENT_NOT_FOUND);
  });

  it('create a new access token with a newly generated signing key', async () => {
    vi.useFakeTimers();

    const fixedDate = new Date('2025-03-25T12:00:00Z');
    vi.setSystemTime(fixedDate);

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProviderWithoutDomain);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);
    const request = createAuthorizedRequest('v1/providers/1/clients/1_1/tokens', {
      expiresIn: 1020,
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    const body = await response.json();
    expect(body.accessToken).toBeDefined();
    expect(body.type).toBe('Bearer');
    expect(body.expiresAt).toBeDefined();

    const claims = jose.decodeJwt(body.accessToken);
    expect(claims.iss).toBe(`https://mockauth.usegrant.local/${fakeDbProvider.urlId}`);
    expect(claims.aud).toBe(fakeDbClient.audience);
    expect(claims.sub).toBe(fakeDbClient.subject);
    expect(claims.exp).toBe(Date.now() / 1000 + 1020);

    // the provider had no key, so one is generated, stored and used for signing
    expect(mockDb.jwks.create).toHaveBeenCalledOnce();
    const [{ data: createdKey }] = mockDb.jwks.create.mock.calls[0];
    expect(createdKey.providerId).toBe('1');
    expect(jose.decodeProtectedHeader(body.accessToken).kid).toBe(createdKey.kid);
    vi.useRealTimers();
  });

  it('create a new access token using custom domain', async () => {
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProviderWithDomain);
    mockDb.client.findUnique.mockResolvedValue(fakeDbClient);

    const request = createAuthorizedRequest('v1/providers/1/clients/1_1/tokens', {
      expiresIn: 1000,
    });
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
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
