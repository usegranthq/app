import { Domain, Provider } from '@/types/app.types';

export const fakeDbApiKey = {
  id: '1',
  userId: '1',
  enabled: true,
  name: 'test-key',
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  metadata: { role: 'test-role' },
  prefix: 'test',
  lastRefillAt: new Date(),
  refillInterval: 86400000, // 1 day in milliseconds
  refillAmount: 100,
  rateLimitEnabled: true,
  rateLimitTimeWindow: 60000, // 1 minute
  rateLimitMax: 100,
  lastRequest: new Date(),
  remaining: 100,
  requestCount: 0,
  start: '2023-01-01T00:00:00Z',
};

export const fakeDbDomain: Domain = {
  id: '1',
  domain: 'test.com',
  providerId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  verified: true,
};

export const fakeDbProvider: Provider = {
  id: '1',
  name: 'test-provider',
  userId: '1',
  description: 'test-description',
  urlId: 'test-url-id',
  rotateJwks: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
