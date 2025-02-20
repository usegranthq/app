import 'server-only';

import { Vercel } from '@vercel/sdk';

import { env } from '@/env';

const vercelProjectId = env.VERCEL_DOMINATE_PROJECT_ID;
const vercelApiToken = env.VERCEL_DOMINATE_API_TOKEN;

const vercelApi = new Vercel({
  bearerToken: vercelApiToken,
});

// ref: https://vercel.com/docs/rest-api/endpoints/projects

const addDomain = (domain: string) => {
  return vercelApi.projects.addProjectDomain({
    idOrName: vercelProjectId,
    requestBody: {
      name: domain,
    },
  });
};

const deleteDomain = (domain: string) => {
  return vercelApi.projects.removeProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const verifyDomain = (domain: string) => {
  return vercelApi.projects.verifyProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const getDomainConfig = (domain: string) => {
  return vercelApi.domains.getDomainConfig({
    domain,
  });
};

const vercel = {
  domains: {
    add: addDomain,
    delete: deleteDomain,
    verify: verifyDomain,
    getConfig: getDomainConfig,
  },
};

export default vercel;
