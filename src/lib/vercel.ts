import 'server-only';

import { Vercel } from '@vercel/sdk';

import { env } from '@/env';

const vercelProjectId = env.VERCEL_DOMINATE_PROJECT_ID;
const vercelApiToken = env.VERCEL_DOMINATE_API_TOKEN;

const vercel = new Vercel({
  bearerToken: vercelApiToken,
});

// ref: https://vercel.com/docs/rest-api/endpoints/projects

const addDomain = (domain: string) => {
  return vercel.projects.addProjectDomain({
    idOrName: vercelProjectId,
    requestBody: {
      name: domain,
    },
  });
};

const deleteDomain = (domain: string) => {
  return vercel.projects.removeProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const verifyDomain = (domain: string) => {
  return vercel.projects.verifyProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const getDomainConfig = (domain: string) => {
  return vercel.domains.getDomainConfig({
    domain,
  });
};

export default {
  domains: {
    add: addDomain,
    delete: deleteDomain,
    verify: verifyDomain,
    getConfig: getDomainConfig,
  },
};
