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
import getClient from './get-client';
import getProvider from './get-provider';
import getTenant from './get-tenant';
import getTenantProvider from './get-tenant-provider';
import validateToken from './validate-token';

const endpoints: Record<string, Endpoint> = {
  createProvider: createProvider,
  getProvider,
  deleteProvider,
  createClient,
  getClient,
  deleteClient,
  createAccessToken,
  createTenant,
  getTenant,
  deleteTenant,
  createTenantProvider,
  getTenantProvider,
  deleteTenantProvider,
  validateToken,
};

export default endpoints;
