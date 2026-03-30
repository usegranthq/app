import { Client, Domain, Provider, Tenant, TenantProvider, TenantProviderPolicy } from '@/types/app.types';

export const fakeDbApiKey = {
  id: '1',
  userId: '1',
  configId: 'default',
  referenceId: '1',
  enabled: true,
  name: 'test-key',
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  metadata: { role: 'test-role' },
  prefix: 'test',
  lastRefillAt: new Date(),
  refillInterval: 86400000, // 1 day in milliseconds
  refillAmount: 100,
  rateLimitEnabled: true,
  rateLimitTimeWindow: 60000, // 1 minute
  rateLimitMax: 100,
  lastRequest: new Date('2025-08-03T18:19:44.344Z'),
  remaining: 100,
  requestCount: 0,
  start: '2023-01-01T00:00:00Z',
};

export const fakeDbDomain: Domain = {
  id: '1',
  domain: 'test.com',
  providerId: '1',
  externalId: 'external-id-123',
  createdAt: new Date('2025-08-02T15:52:17.359Z'),
  updatedAt: new Date('2025-08-02T15:52:17.359Z'),
  verified: true,
};

export const fakeDbDomainResposne: Omit<Domain, 'providerId' | 'externalId'> = {
  id: '1',
  domain: 'test.com',
  createdAt: new Date('2025-08-02T15:52:17.359Z'),
  updatedAt: new Date('2025-08-02T15:52:17.359Z'),
  verified: true,
};

export const fakeDbDomainResponse: Omit<Domain, 'externalId' | 'providerId'> = {
  id: '1',
  domain: 'test.com',
  createdAt: new Date('2025-08-02T15:52:17.359Z'),
  updatedAt: new Date('2025-08-02T15:52:17.359Z'),
  verified: true,
};

export const fakeDbProvider: Provider = {
  id: '1',
  name: 'test-provider',
  userId: '1',
  description: 'test-description',
  urlId: 'test-url-id',
  rotateJwks: true,
  createdAt: new Date('2025-08-02T15:52:17.359Z'),
  updatedAt: new Date('2025-08-02T15:52:17.359Z'),
};

export const fakeDbProviderResponse: Omit<Provider, 'userId'> = {
  id: '1',
  name: 'test-provider',
  description: 'test-description',
  urlId: 'test-url-id',
  rotateJwks: true,
  createdAt: new Date('2025-08-02T15:52:17.359Z'),
  updatedAt: new Date('2025-08-02T15:52:17.359Z'),
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
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
};

export const fakeDbClientResponse: Omit<Client, 'providerId'> = {
  id: '1',
  name: 'test-client',
  audience: 'test-audience',
  subject: 'test-subject',
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
};

export const fakeDbTenant: Tenant = {
  id: '1',
  name: 'test-tenant',
  description: 'test-description',
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
  userId: '1',
};

export const fakeDbTenantResponse: Omit<Tenant, 'userId'> = {
  id: '1',
  name: 'test-tenant',
  description: 'test-description',
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
};

export const fakeDbTenantProvider: TenantProvider = {
  id: '1',
  earliestIssuanceTimeAllowed: 1,
  fingerprints: ['test-fingerprint'],
  url: 'https://test.com',
  audience: 'test-audience',
  tenantId: '1',
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
};

export const fakeDbTenantProviderResponse: Omit<TenantProvider, 'tenantId'> = {
  id: '1',
  earliestIssuanceTimeAllowed: 1,
  fingerprints: ['test-fingerprint'],
  url: 'https://test.com',
  audience: 'test-audience',
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
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
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
};

export const fakeDbTenantProviderPolicyResposne: Omit<TenantProviderPolicy, 'tenantProviderId'> = {
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
  createdAt: new Date('2025-08-03T18:19:44.344Z'),
  updatedAt: new Date('2025-08-03T18:19:44.344Z'),
};
