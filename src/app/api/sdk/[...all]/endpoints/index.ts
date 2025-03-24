import { Endpoint } from 'better-call';

import addDomain from './add-domain';
import createAccessToken from './create-access-token';
import createClient from './create-client';
import createProvider from './create-provider';
import createTenant from './create-tenant';
import createTenantProvider from './create-tenant-provider';
import createTenantProviderPolicy from './create-tenant-provider-policy';
import deleteClient from './delete-client';
import deleteDomain from './delete-domain';
import deleteProvider from './delete-provider';
import deleteTenant from './delete-tenant';
import deleteTenantProvider from './delete-tenant-provider';
import deleteTenantProviderPolicy from './delete-tenant-provider-policy';
import getClient from './get-client';
import getDomain from './get-domain';
import getProvider from './get-provider';
import getTenant from './get-tenant';
import getTenantProvider from './get-tenant-provider';
import getTenantProviderPolicy from './get-tenant-provider-policy';
import listClients from './list-clients';
import listDomains from './list-domains';
import listProviders from './list-providers';
import listTenantProviderPolicies from './list-tenant-provider-policy';
import listTenantProviders from './list-tenant-providers';
import listTenants from './list-tenants';
import validateToken from './validate-token';
import verifyDomain from './verify-domain';

const endpoints: Record<string, Endpoint> = {
  // Provider endpoints
  listProviders,
  getProvider,
  createProvider,
  deleteProvider,

  // Domain endpoints
  listDomains,
  getDomain,
  addDomain,
  verifyDomain,
  deleteDomain,

  // Client endpoints
  listClients,
  getClient,
  createClient,
  deleteClient,

  // Tenant endpoints
  listTenants,
  getTenant,
  createTenant,
  deleteTenant,

  // Tenant provider endpoints
  listTenantProviders,
  getTenantProvider,
  createTenantProvider,
  deleteTenantProvider,

  // Tenant provider policy endpoints
  listTenantProviderPolicies,
  getTenantProviderPolicy,
  createTenantProviderPolicy,
  deleteTenantProviderPolicy,

  // Token endpoints
  createAccessToken,
  validateToken,
};

export default endpoints;
