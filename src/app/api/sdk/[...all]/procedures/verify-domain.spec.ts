import { describe, expect, it } from 'vitest';

import mockDb from '@/lib/__mocks__/db';
import mockCustomDomain from '@/lib/__mocks__/domain';
import ERRORS from '@/utils/error';
import { sillyClone } from '@/utils/object';
import { STATUS_CODES } from '@/utils/rest';

import { fakeDbDomain, fakeDbDomainResposne, fakeDbProvider } from './test-utils/fake-data';
import createAuthorizedRequest from './test-utils/request';
import { mockProPlanSubscription } from './test-utils/subscription';

describe('SDK: Verify Domain', () => {
  it('throw if the plan does not have custom domains available', async () => {
    const request = createAuthorizedRequest('v1/providers/1/domains/1/verify');
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toMatchObject(ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE);
  });

  it('throw if the provider does not exist', async () => {
    mockProPlanSubscription();
    const request = createAuthorizedRequest('v1/providers/1/domains/1/verify');
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw if the domain does not exist', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    const request = createAuthorizedRequest('v1/providers/1/domains/1/verify');
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toMatchObject(ERRORS.DOMAIN_NOT_FOUND);
  });

  it('throw if the domain is not verified', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findUnique.mockResolvedValue(fakeDbDomain);
    mockCustomDomain.verify.mockResolvedValue(false);

    const request = createAuthorizedRequest('v1/providers/1/domains/1/verify');
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.OK);
    await expect(response.json()).resolves.toEqual({
      verified: false,
      message: 'Failed to verify domain.',
      domain: null,
    });
  });

  it('verify the domain', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findUnique.mockResolvedValue(fakeDbDomain);
    mockCustomDomain.verify.mockResolvedValue(true);
    mockDb.domain.update.mockResolvedValue(fakeDbDomain);

    const request = createAuthorizedRequest('v1/providers/1/domains/1/verify');
    const response = await request.post();
    expect(response.status).toBe(STATUS_CODES.OK);
    await expect(response.json()).resolves.toEqual({
      verified: true,
      message: 'Domain verified successfully',
      domain: sillyClone(fakeDbDomainResposne),
    });
  });
});
