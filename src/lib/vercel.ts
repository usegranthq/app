import 'server-only';

import ky, { HTTPError as APIError } from 'ky';

const vercelProjectId = process.env.VERCEL_DOMINATE_PROJECT_ID;
const vercelApiToken = process.env.VERCEL_DOMINATE_API_TOKEN;

const vapi = ky.create({
  prefixUrl: 'https://api.vercel.com/v10',
  headers: {
    Authorization: `Bearer ${vercelApiToken}`,
  },
});

interface DomainResponse {
  name: string;
  verified: boolean;
}

export { APIError };

// ref: https://vercel.com/docs/rest-api/endpoints/projects

export const addDomain = (domain: string): Promise<DomainResponse> => {
  return vapi.post(`projects/${vercelProjectId}/domains`, { json: { name: domain } }).json();
};

export const deleteDomain = (domain: string) => {
  return vapi.delete(`projects/${vercelProjectId}/domains/${domain}`).json();
};

export const verifyDomain = (domain: string): Promise<DomainResponse> => {
  return vapi.post(`projects/${vercelProjectId}/domains/${domain}/verify`).json();
};

export default vapi;
