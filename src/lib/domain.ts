import vercel from './vercel';

type DomainVerificationStatus =
  | 'Valid Configuration'
  | 'Pending Verification'
  | 'Invalid Configuration'
  | 'Unknown Error';

const verifyDomain = async (domain: string): Promise<[boolean, DomainVerificationStatus]> => {
  let isVerified = true;
  let status: DomainVerificationStatus = 'Valid Configuration';

  try {
    const [domainResponse, domainConfig] = await Promise.all([
      vercel.domains.verify(domain),
      vercel.domains.getConfig(domain),
    ]);

    if (domainResponse.verified) {
      return [isVerified, status];
    }

    const verifyDomainResponse = await vercel.domains.verify(domain);
    if (verifyDomainResponse.verified) {
      return [isVerified, status];
    }

    if (domainConfig.misconfigured) {
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
  verify: verifyDomain,
};

export default customDomain;
