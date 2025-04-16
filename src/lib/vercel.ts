import 'server-only';

import { Vercel } from '@vercel/sdk';

import { env } from '@/env';

const vercelTeamId = env.VERCEL_DOMINATE_TEAM_ID;
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

const getDomain = (domain: string) => {
  return vercelApi.projects.getProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const removeDomain = async (domain: string) => {
  await vercelApi.projects.removeProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
  await vercelApi.domains.deleteDomain({
    domain,
    teamId: vercelTeamId,
  });
};

const verifyDomain = (domain: string) => {
  return vercelApi.projects.verifyProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const getDomainConfig = (domain: string) => {
  return vercelApi.domains.getDomainConfig({ domain });
};

const vercel = {
  domains: {
    add: addDomain,
    get: getDomain,
    remove: removeDomain,
    verify: verifyDomain,
    getConfig: getDomainConfig,
  },
};

export default vercel;
