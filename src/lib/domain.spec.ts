import { describe, expect, it } from 'vitest';

import mockVercel from './__mocks__/vercel';
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
    mockVercel.domains.add.mockResolvedValue({
      name: 'test.com',
      verified: true,
      apexName: 'test.com',
      projectId: '1',
    });

    mockVercel.domains.getConfig.mockResolvedValue({
      misconfigured: false,
    });

    const [isVerified, status] = await customDomain.add('test.com');
    expect(isVerified).toBe(true);
    expect(status).toBe('Valid Configuration');
  });

  it('successfully remove a domain', async () => {
    mockVercel.domains.remove.mockResolvedValue();

    await customDomain.remove('test.com');
    expect(mockVercel.domains.remove).toHaveBeenCalledWith('test.com');
  });

  it('successfully verify a domain', async () => {
    mockVercel.domains.get.mockResolvedValue({
      verified: true,
      name: 'test.com',
      apexName: 'test.com',
      projectId: '1',
    });

    mockVercel.domains.getConfig.mockResolvedValue({
      misconfigured: false,
    });

    const [isVerified, status] = await customDomain.verify('test.com');
    expect(isVerified).toBe(true);
    expect(status).toBe('Valid Configuration');
  });

  it('return not verified if misconfigured', async () => {
    mockVercel.domains.get.mockResolvedValue({
      verified: false,
      name: 'test.com',
      apexName: 'test.com',
      projectId: '1',
    });

    mockVercel.domains.getConfig.mockResolvedValue({
      misconfigured: true,
    });

    mockVercel.domains.verify.mockResolvedValue({
      verified: false,
      name: 'test.com',
      apexName: 'test.com',
      projectId: '1',
    });

    const [isVerified, status] = await customDomain.verify('test.com');
    expect(isVerified).toBe(false);
    expect(status).toBe('Invalid Configuration');
  });

  it('return verified if not misconfigured and not verified', async () => {
    mockVercel.domains.get.mockResolvedValue({
      verified: false,
      name: 'test.com',
      apexName: 'test.com',
      projectId: '1',
    });

    mockVercel.domains.getConfig.mockResolvedValue({
      misconfigured: false,
    });

    mockVercel.domains.verify.mockResolvedValue({
      verified: false,
      name: 'test.com',
      apexName: 'test.com',
      projectId: '1',
    });

    const [isVerified, status] = await customDomain.verify('test.com');
    expect(isVerified).toBe(false);
    expect(status).toBe('Invalid Configuration');
  });
});
