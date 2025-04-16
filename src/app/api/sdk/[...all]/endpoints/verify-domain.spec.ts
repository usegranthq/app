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

describe('SDK: Verify Domain', () => {
  it('throw if the plan does not have custom domains available', async () => {
    const request = authorizedRequest('v1/providers/1/domains/1/verify', {
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    await expect(response.json()).resolves.toEqual(ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE);
  });

  it('throw if the provider does not exist', async () => {
    mockProPlanSubscription();
    const request = authorizedRequest('v1/providers/1/domains/1/verify', {
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.PROVIDER_NOT_FOUND);
  });

  it('throw if the domain does not exist', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    const request = authorizedRequest('v1/providers/1/domains/1/verify', {
      method: 'POST',
    });
    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    await expect(response.json()).resolves.toEqual(ERRORS.DOMAIN_NOT_FOUND);
  });

  it('throw if the domain is not verified', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findUnique.mockResolvedValue(fakeDbDomain);

    mockVercel.domains.verify.mockResolvedValue({
      name: 'test.com',
      verified: false,
      apexName: 'test.com',
      projectId: '1',
    });
    mockVercel.domains.getConfig.mockResolvedValue({ misconfigured: false });

    const request = authorizedRequest('v1/providers/1/domains/1/verify', {
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    await expect(response.json()).resolves.toEqual({
      verified: false,
      message: 'Failed to verify domain. Invalid Configuration.',
      domain: null,
    });
  });

  it('throw if the domain is not verified and misconfigured', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findUnique.mockResolvedValue(fakeDbDomain);

    mockVercel.domains.verify.mockResolvedValue({
      name: 'test.com',
      verified: false,
      apexName: 'test.com',
      projectId: '1',
    });
    mockVercel.domains.getConfig.mockResolvedValue({ misconfigured: true });

    const request = authorizedRequest('v1/providers/1/domains/1/verify', {
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    await expect(response.json()).resolves.toEqual({
      verified: false,
      message: 'Failed to verify domain. Invalid Configuration.',
      domain: null,
    });
  });

  it('verify the domain', async () => {
    mockProPlanSubscription();
    mockDb.provider.findUnique.mockResolvedValue(fakeDbProvider);
    mockDb.domain.findUnique.mockResolvedValue(fakeDbDomain);

    mockVercel.domains.verify.mockResolvedValue({
      name: 'test.com',
      verified: true,
      apexName: 'test.com',
      projectId: '1',
    });
    mockVercel.domains.getConfig.mockResolvedValue({ misconfigured: false });

    mockDb.domain.update.mockResolvedValue(fakeDbDomain);

    const request = authorizedRequest('v1/providers/1/domains/1/verify', {
      method: 'POST',
    });

    const response = await handler(request);
    expect(response.status).toBe(STATUS_CODES.OK);
    await expect(response.json()).resolves.toEqual({
      verified: true,
      message: 'Domain verified successfully',
      domain: sillyClone(fakeDbDomain),
    });
  });
});
