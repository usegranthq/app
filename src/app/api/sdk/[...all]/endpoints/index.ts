import { Endpoint } from 'better-call';

import createAccessToken from './create-access-token';
import createClient from './create-client';
import createProvider from './create-provider';
import createTenant from './create-tenant';
import createTenantProvider from './create-tenant-provider';
import deleteClient from './delete-client';
import deleteProvider from './delete-provider';
import deleteTenant from './delete-tenant';
import deleteTenantProvider from './delete-tenant-provider';
import getAllClients from './get-all-clients';
import getAllProviders from './get-all-providers';
import getAllTenantProviders from './get-all-tenant-providers';
import getAllTenants from './get-all-tenants';
import getClient from './get-client';
import getProvider from './get-provider';
import getTenant from './get-tenant';
import getTenantProvider from './get-tenant-provider';
import validateToken from './validate-token';

const endpoints: Record<string, Endpoint> = {
  getAllProviders,
  createProvider: createProvider,
  getProvider,
  deleteProvider,
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
  validateToken,
};

export default endpoints;
