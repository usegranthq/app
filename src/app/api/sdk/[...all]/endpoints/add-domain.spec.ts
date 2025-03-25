import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';
import mockVercel from '@/lib/__mocks__/vercel';

import handler from '../handler';
import { fakeDbDomain, fakeDbProvider } from './test-utils/fake-data';
import { authorizedRequest } from './test-utils/request';
import { mockProPlanSubscription } from './test-utils/subscription';

describe('SDK: Add Domain', () => {
  it('should throw if the domain is not valid', async () => {
    const request = authorizedRequest('v1/providers/1/domains', {
      body: {
        domain: '123',
      },
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    await expect(response.json()).resolves.toEqual(ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR);
  });

  it('should not allow to add domain if the user does not have a plan', async () => {
    mockDb.customer.findUnique.mockResolvedValue(null);

    const request = authorizedRequest('v1/providers/1/domains', {
      body: {
        domain: 'test.com',
      },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE);
  });

  it('should throw if the provider does not exist', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(null);

    const request = authorizedRequest('v1/providers/1/domains', {
      body: { domain: 'test.com' },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('should add the domain if the domain is already added', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([fakeDbDomain]);

    const request = authorizedRequest('v1/providers/1/domains', {
      body: { domain: fakeDbDomain.domain },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CONFLICT);
    await expect(response.json()).resolves.toEqual(ERRORS.DOMAIN_ALREADY_ADDED);
  });

  it('should throw if the user has reached the max domains limit', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([fakeDbDomain]);

    const request = authorizedRequest('v1/providers/1/domains', {
      body: { domain: 'test2.com' },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.MAX_DOMAINS_LIMIT_REACHED);
  });

  it('should add the domain if the domain is not added', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([]);

    mockVercel.domains.add.mockResolvedValue({
      name: 'test.com',
      verified: true,
      apexName: 'test.com',
      projectId: '1',
    });

    mockVercel.domains.getConfig.mockResolvedValue({
      misconfigured: false,
    });

    mockDb.domain.create.mockResolvedValue(fakeDbDomain);

    const request = authorizedRequest('v1/providers/1/domains', {
      body: { domain: 'test.com' },
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toMatchObject(sillyClone(fakeDbDomain));
  });
});
