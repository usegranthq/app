import { Endpoint } from 'better-call';

import createProvider from './create-provider';
import getProvider from './get-provider';
import deleteProvider from './delete-provider';

import createClient from './create-client';
import getClient from './get-client';
import deleteClient from './delete-client';

import createAccessToken from './create-access-token';

const endpoints: Record<string, Endpoint> = {
  createProvider: createProvider,
  getProvider,
  deleteProvider,
  createClient,
  getClient,
  deleteClient,
  createAccessToken,
};

export default endpoints;
