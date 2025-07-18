import { describe, expect, it } from 'vitest';

import mockCloudflare from './__mocks__/cloudflare';
import customDomain from './domain';

describe('Custom Domain', () => {
  it('be an object', () => {
    expect(typeof customDomain).toBe('object');
  });

  it('have the expected methods', () => {
    expect(customDomain.add).toBeInstanceOf(Function);
    expect(customDomain.remove).toBeInstanceOf(Function);
    expect(customDomain.verify).toBeInstanceOf(Function);
  });

  it('successfully add a domain', async () => {
    mockCloudflare.domains.add.mockResolvedValue({
      id: '123',
      status: 'active',
      hostname: 'test.com',
      ssl: {},
    });

    const extDomain = await customDomain.add('test.com');
    expect(extDomain.verified).toBe(true);
    expect(extDomain.id).toBe('123');
  });

  it('successfully remove a domain', async () => {
    await customDomain.remove('external-id');
    expect(mockCloudflare.domains.delete).toHaveBeenCalledWith('external-id');
  });

  it('successfully verify a domain', async () => {
    mockCloudflare.domains.get.mockResolvedValue({
      id: '123',
      status: 'active',
      hostname: 'test.com',
      ssl: {},
    });

    const isVerified = await customDomain.verify('test.com');
    expect(isVerified).toBe(true);
  });

  it('return not verified status not active', async () => {
    mockCloudflare.domains.get.mockResolvedValue({
      id: '123',
      status: 'pending',
      hostname: 'test.com',
      ssl: {},
    });

    const isVerified = await customDomain.verify('test.com');
    expect(isVerified).toBe(false);
  });
});
