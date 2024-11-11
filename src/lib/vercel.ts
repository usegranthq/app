import 'server-only';

import ky from 'ky';

const vercelProjectId = process.env.VERCEL_DOMINATE_PROJECT_ID;
const vercelApiToken = process.env.VERCEL_DOMINATE_API_TOKEN;

const vapi = ky.create({
  prefixUrl: 'https://api.vercel.com/v10',
  headers: {
    Authorization: `Bearer ${vercelApiToken}`,
  },
});

interface AddDomainResponse {
  name: string;
  verified: boolean;
}

export const addDomain = (domain: string): Promise<AddDomainResponse> => {
  return vapi.post(`projects/${vercelProjectId}/domains`, { json: { name: domain } }).json();
};

export const deleteDomain = (domain: string) => {
  return vapi.delete(`projects/${vercelProjectId}/domains/${domain}`);
};

export default vapi;
