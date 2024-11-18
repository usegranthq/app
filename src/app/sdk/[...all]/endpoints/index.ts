import { Endpoint } from 'better-call';

import createProject from './create-project';
import getProject from './get-project';
import deleteProject from './delete-project';

import createClient from './create-client';
import getClient from './get-client';
import deleteClient from './delete-client';

import createAccessToken from './create-access-token';

const endpoints: Record<string, Endpoint> = {
  createProject,
  getProject,
  deleteProject,
  createClient,
  getClient,
  deleteClient,
  createAccessToken,
};

export default endpoints;
