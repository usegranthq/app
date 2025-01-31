import { Endpoint } from 'better-call';

import createProvider from './create-provider';
import getProvider from './get-provider';
import deleteProvider from './delete-provider';

import createClient from './create-client';
import getClient from './get-client';
import deleteClient from './delete-client';

import createAccessToken from './create-access-token';

import createTenant from './create-tenant';
import deleteTenant from './delete-tenant';

import createTenantProvider from './create-tenant-provider';
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
  deleteTenant,
  createTenantProvider,
  validateToken,
};

export default endpoints;
