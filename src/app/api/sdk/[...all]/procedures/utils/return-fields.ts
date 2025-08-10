import { Prisma } from '@/prisma/client';

const commonFields = {
  createdAt: true,
  updatedAt: true,
};

export const providerFields: Prisma.ProviderSelect = {
  id: true,
  name: true,
  description: true,
  urlId: true,
  rotateJwks: true,
  ...commonFields,
};

export const domainFields: Prisma.DomainSelect = {
  id: true,
  domain: true,
  verified: true,
  ...commonFields,
};

export const clientFields: Prisma.ClientSelect = {
  id: true,
  name: true,
  audience: true,
  ...commonFields,
};

export const tenantFields: Prisma.TenantSelect = {
  id: true,
  name: true,
  description: true,
  ...commonFields,
};

export const tenantProviderFields: Prisma.TenantProviderSelect = {
  id: true,
  url: true,
  fingerprints: true,
  audience: true,
  earliestIssuanceTimeAllowed: true,
  ...commonFields,
};

export const tokenProviderPolicyFields: Prisma.TenantProviderPolicySelect = {
  id: true,
  name: true,
  description: true,
  audience: true,
  conditions: true,
  ...commonFields,
};
