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
import getAllClients from './get-all-clients';
import getAllDomains from './get-all-domains';
import getAllProviders from './get-all-providers';
import getAllTenantProviders from './get-all-tenant-providers';
import getAllTenants from './get-all-tenants';
import getClient from './get-client';
import getDomain from './get-domain';
import getProvider from './get-provider';
import getTenant from './get-tenant';
import getTenantProvider from './get-tenant-provider';
import getTenantProviderPolicy from './get-tenant-provider-policy';
import listTenantProviderPolicies from './list-tenant-provider-policy';
import validateToken from './validate-token';
import verifyDomain from './verify-domain';

const endpoints: Record<string, Endpoint> = {
  getAllProviders,
  createProvider,
  getProvider,
  deleteProvider,
  getAllDomains,
  addDomain,
  getDomain,
  deleteDomain,
  verifyDomain,
  getAllClients,
  createClient,
  getClient,
  deleteClient,
  createAccessToken,
  getAllTenants,
  createTenant,
  getTenant,
  deleteTenant,
  getAllTenantProviders,
  createTenantProvider,
  getTenantProvider,
  deleteTenantProvider,
  createTenantProviderPolicy,
  deleteTenantProviderPolicy,
  getTenantProviderPolicy,
  listTenantProviderPolicies,
  validateToken,
};

export default endpoints;
