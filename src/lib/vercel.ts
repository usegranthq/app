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

const blackListedDomains = ['usegrant.dev', 'vercel.app'];
const verifyBlackListedDomain = (domain: string) => {
  if (blackListedDomains.includes(domain)) {
    throw new Error('Domain is blacklisted');
  }
};

const addDomain = (domain: string) => {
  verifyBlackListedDomain(domain);

  return vercelApi.projects.addProjectDomain({
    idOrName: vercelProjectId,
    requestBody: {
      name: domain,
    },
  });
};

const deleteDomain = async (domain: string) => {
  verifyBlackListedDomain(domain);

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
  verifyBlackListedDomain(domain);

  return vercelApi.projects.verifyProjectDomain({
    idOrName: vercelProjectId,
    domain,
  });
};

const getDomainConfig = (domain: string) => {
  verifyBlackListedDomain(domain);

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
