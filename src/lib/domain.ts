import cloudflare from './cloudflare';

const blackListedDomains = ['usegrant.dev'];

const verifyBlackListedDomain = (domain: string) => {
  if (blackListedDomains.includes(domain)) {
    throw new Error('Domain not allowed');
  }
};

type DomainVerificationStatus =
  | 'Valid Configuration'
  | 'Pending Verification'
  | 'Invalid Configuration'
  | 'Unknown Error';

const addDomain = async (domain: string) => {
  verifyBlackListedDomain(domain);

  const addDomainResponse = await cloudflare.domains.add(domain);
  return {
    id: addDomainResponse.id,
    verified: addDomainResponse.status === 'active',
  };
};

const removeDomain = async (domainId: string) => {
  await cloudflare.domains.delete(domainId);
};

const verifyDomain = async (domainId: string) => {
  // force validation
  await cloudflare.domains.edit(domainId);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second to allow Cloudflare to process the edit
  const domainResponse = await cloudflare.domains.get(domainId);

  return domainResponse.status === 'active';
};

const customDomain = {
  add: addDomain,
  remove: removeDomain,
  verify: verifyDomain,
};

export default customDomain;
