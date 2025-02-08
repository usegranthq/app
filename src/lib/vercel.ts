import 'server-only';

import ky, { HTTPError as APIError } from 'ky';

import { env } from '@/env';

const vercelProjectId = env.VERCEL_DOMINATE_PROJECT_ID;
const vercelApiToken = env.VERCEL_DOMINATE_API_TOKEN;

const vapi = ky.create({
  prefixUrl: 'https://api.vercel.com',
  headers: {
    Authorization: `Bearer ${vercelApiToken}`,
  },
});

interface DomainResponse {
  name: string;
  verified: boolean;
}

export interface DomainConfigResponse {
  nameservers: string[];
  cnames: string[];
  aValues: string[];
  misconfigured: boolean;
}

export { APIError };

// ref: https://vercel.com/docs/rest-api/endpoints/projects

export const addDomain = (domain: string): Promise<DomainResponse> => {
  return vapi.post(`v10/projects/${vercelProjectId}/domains`, { json: { name: domain } }).json();
};

export const deleteDomain = (domain: string) => {
  return vapi.delete(`v10/projects/${vercelProjectId}/domains/${domain}`).json();
};

export const verifyDomain = (domain: string): Promise<DomainResponse> => {
  return vapi.post(`v10/projects/${vercelProjectId}/domains/${domain}/verify`).json();
};

export const getDomainConfig = (domain: string): Promise<DomainConfigResponse> => {
  return vapi.get(`v6/domains/${domain}/config`).json();
};

export default vapi;
