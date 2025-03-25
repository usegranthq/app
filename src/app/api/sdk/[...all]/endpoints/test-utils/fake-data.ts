import { Client, Domain, Provider, Tenant, TenantProvider, TenantProviderPolicy } from '@/types/app.types';

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

export const fakeDbProviderWithDomain: Provider & { Domain: Domain[] } = {
  ...fakeDbProvider,
  Domain: [fakeDbDomain],
};

export const fakeDbClient: Client = {
  id: '1',
  name: 'test-client',
  providerId: '1',
  audience: 'test-audience',
  subject: 'test-subject',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeDbTenant: Tenant = {
  id: '1',
  name: 'test-tenant',
  description: 'test-description',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '1',
};

export const fakeDbTenantProvider: TenantProvider = {
  id: '1',
  earliestIssuanceTimeAllowed: 1,
  fingerprints: ['test-fingerprint'],
  url: 'https://test.com',
  audience: 'test-audience',
  tenantId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeDbTenantProviderPolicy: TenantProviderPolicy = {
  id: '1',
  name: 'test-tenant-provider-policy',
  description: 'test-description',
  audience: 'test-audience',
  conditions: [
    {
      key: 'sub',
      operator: 'stringLike',
      value: 'test-value',
    },
  ],
  tenantProviderId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
