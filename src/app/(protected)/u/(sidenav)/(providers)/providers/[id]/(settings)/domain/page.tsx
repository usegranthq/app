import { notFound } from 'next/navigation';

import { getDomains, getProvider } from '@/data/providers';
import { getPlanDetails } from '@/data/user';
import { getDefaultDomain, getDefaultDomainHostname } from '@/app/provider-helpers';
import { FeatureUnavailable } from '@/components/FeatureUnavailable';

import CaDetails from './CaDetails';
import DomainDetails from './DomainDetails';
import CustomDomains from './Domains';

interface DomainPageProps {
  params: Promise<{ id: string }>;
}

export default async function DomainPage(props: DomainPageProps) {
  const { id } = await props.params;
  const providerPromise = getProvider(id);
  const domainsPromise = getDomains(id);
  const plan = await getPlanDetails();

  const [provider, domains] = await Promise.all([providerPromise, domainsPromise]);

  if (!provider) {
    return notFound();
  }

  const defaultDomain = getDefaultDomain(provider.urlId);
  const defaultDomainHostname = getDefaultDomainHostname(provider.urlId);

  const isCustomDomainAvailable = plan.features.customDomain.available;

  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">Manage domain</h1>
      <div className="flex flex-col gap-8">
        <FeatureUnavailable available={isCustomDomainAvailable} name="Custom domain">
          {domains.length === 0 && <DomainDetails provider={provider} domains={domains} />}
          <CustomDomains provider={provider} domains={domains} />
        </FeatureUnavailable>
        <CaDetails defaultDomain={defaultDomain} defaultDomainHostname={defaultDomainHostname} domains={domains} />
      </div>
    </div>
  );
}
