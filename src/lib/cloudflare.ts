import 'server-only';
import Cloudflare from 'cloudflare';

import env from '@/env';

const cloudflareApi = new Cloudflare({
  apiToken: env.CLOUDFLARE_API_TOKEN,
});

// ref: https://developers.cloudflare.com/api/resources/custom_hostnames

const addDomain = (domain: string) => {
  return cloudflareApi.customHostnames.create({
    hostname: domain,
    zone_id: env.CLOUDFLARE_ZONE_ID,
    ssl: {
      method: 'http',
      type: 'dv',
    },
  });
};

const editDomain = (domainId: string) => {
  return cloudflareApi.customHostnames.edit(domainId, {
    zone_id: env.CLOUDFLARE_ZONE_ID,
    ssl: {
      method: 'http',
      type: 'dv',
    },
  });
};

const getDomain = (domainId: string) => {
  return cloudflareApi.customHostnames.get(domainId, {
    zone_id: env.CLOUDFLARE_ZONE_ID,
  });
};

const deleteDomain = async (domainId: string) => {
  await cloudflareApi.customHostnames.delete(domainId, {
    zone_id: env.CLOUDFLARE_ZONE_ID,
  });
};

const cloudflare = {
  domains: {
    add: addDomain,
    edit: editDomain,
    get: getDomain,
    delete: deleteDomain,
  },
};

export default cloudflare;
