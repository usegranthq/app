import { describe, expect, it } from 'vitest';

import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';
import mockDb from '@/lib/__mocks__/db';
import mockCustomDomain from '@/lib/__mocks__/domain';

import { fakeDbDomain, fakeDbDomainResponse, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';
import { mockProPlanSubscription } from './test-utils/subscription';

describe('SDK: Add Domain', () => {
  it('throw if the domain is not valid', async () => {
    // Mock the auth to return a valid user
    mockDb.customer.findUnique.mockResolvedValue(null);

    const request = createAuthorizedRequest('v1/providers/1/domains', {
      domain: '123',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject({
      ...ERRORS.GENERIC_SCHEMA_VALIDATION_ERROR,
      data: {
        domain: ['Please enter a valid domain name.'],
      },
    });
  });

  it('not allow to add domain if the user does not have a plan', async () => {
    mockDb.customer.findUnique.mockResolvedValue(null);

    const request = createAuthorizedRequest('v1/providers/1/domains', {
      domain: 'test.com',
    });

    const response = await request.post();

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE);
  });

  it('throw if the provider does not exist', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(null);

    const request = createAuthorizedRequest('v1/providers/1/domains', {
      domain: 'test.com',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('add the domain if the domain is already added', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([fakeDbDomain]);

    const request = createAuthorizedRequest('v1/providers/1/domains', {
      domain: fakeDbDomain.domain,
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CONFLICT);
    await expect(response.json()).resolves.toMatchObject(ERRORS.DOMAIN_ALREADY_ADDED);
  });

  it('throw if the user has reached the max domains limit', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([fakeDbDomain]);

    const request = createAuthorizedRequest('v1/providers/1/domains', {
      domain: 'test2.com',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.MAX_DOMAINS_LIMIT_REACHED);
  });

  it('add the domain if the domain is not added', async () => {
    mockProPlanSubscription();

    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findMany.mockResolvedValue([]);
    mockCustomDomain.add.mockResolvedValue({ id: '123', verified: true });
    mockDb.domain.create.mockResolvedValue(fakeDbDomain);

    const request = createAuthorizedRequest('v1/providers/1/domains', {
      domain: 'test.com',
    });

    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await expect(response.json()).resolves.toMatchObject(sillyClone(fakeDbDomainResponse));
  });
});
