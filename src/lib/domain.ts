import vercel from './vercel';

const blackListedDomains = ['usegrant.dev', 'vercel.app', 'vercel.pub'];

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

const addDomain = async (domain: string): Promise<[boolean, DomainVerificationStatus]> => {
  verifyBlackListedDomain(domain);

  try {
    const addDomainResponse = await vercel.domains.add(domain);
    const domainConfigResponse = await vercel.domains.getConfig(domain);
    const isVerified = addDomainResponse.verified && !domainConfigResponse.misconfigured;
    return [isVerified, 'Valid Configuration'];
  } catch {}

  return [false, 'Invalid Configuration'];
};

const removeDomain = async (domain: string) => {
  verifyBlackListedDomain(domain);

  try {
    await vercel.domains.remove(domain); // removes from project
    await vercel.domains.delete(domain); // deletes from vercel
  } catch (err) {
    throw err;
  }
};

const verifyDomain = async (domain: string): Promise<[boolean, DomainVerificationStatus]> => {
  let isVerified = true;
  let status: DomainVerificationStatus = 'Valid Configuration';

  verifyBlackListedDomain(domain);

  try {
    const [domainResponse, domainConfigResponse] = await Promise.all([
      vercel.domains.get(domain),
      vercel.domains.getConfig(domain),
    ]);

    if (domainResponse.verified) {
      return [isVerified, status];
    }

    const verifyDomainResponse = await vercel.domains.verify(domain);
    if (verifyDomainResponse.verified) {
      return [isVerified, status];
    }

    if (domainConfigResponse.misconfigured) {
      isVerified = false;
      status = 'Invalid Configuration';
    }

    isVerified = false;
    status = 'Invalid Configuration';
  } catch {
    isVerified = false;
    status = 'Unknown Error';
  }

  return [isVerified, status];
};

const customDomain = {
  add: addDomain,
  remove: removeDomain,
  verify: verifyDomain,
};

export default customDomain;
