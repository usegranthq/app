import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import mockDb from '@/lib/__mocks__/db';

import { GET } from './route';

const HOUR = 60 * 60 * 1000;
const now = new Date('2026-03-25T12:00:00Z');
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * HOUR);

const runCron = async () => {
  const request = new NextRequest('http://localhost/api/cron', {
    headers: { authorization: 'Bearer xxxx' },
  });
  const response = await GET(request);
  expect(response.status).toBe(200);

  // the cron handler doesn't await processing, wait for the transaction to finish
  await vi.waitFor(() => expect(mockDb.$transaction).toHaveBeenCalled());
  await vi.waitFor(() => expect(mockDb.$transaction.mock.results[0]?.value).resolves.toBeUndefined());
};

describe('Cron: signing key rotation', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(now);

    mockDb.provider.findMany.mockResolvedValue([{ id: 'provider-1' }] as never);
    mockDb.$transaction.mockImplementation((async (fn: (tx: typeof mockDb) => Promise<unknown>) =>
      fn(mockDb)) as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('skip rotation when the current key is less than a day old', async () => {
    mockDb.jwks.findMany.mockResolvedValue([{ id: 'k0', createdAt: hoursAgo(5) }] as never);

    await runCron();

    expect(mockDb.jwks.deleteMany).not.toHaveBeenCalled();
    expect(mockDb.jwks.create).not.toHaveBeenCalled();
  });

  it('rotate and delete only keys replaced more than MAX_EXPIRY ago', async () => {
    mockDb.jwks.findMany.mockResolvedValue([
      { id: 'k0', createdAt: hoursAgo(25) }, // current key, replaced now
      { id: 'k1', createdAt: hoursAgo(30) }, // replaced 25 hours ago
      { id: 'k2', createdAt: hoursAgo(72) }, // replaced 30 hours ago
      { id: 'k3', createdAt: hoursAgo(96) }, // replaced 72 hours ago
    ] as never);

    await runCron();

    expect(mockDb.jwks.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['k3'] } } });
    expect(mockDb.jwks.create).toHaveBeenCalledOnce();
    expect(mockDb.jwks.create.mock.calls[0][0].data.providerId).toBe('provider-1');
  });
});
