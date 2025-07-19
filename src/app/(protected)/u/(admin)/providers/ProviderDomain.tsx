import Link from 'next/link';

import { Provider } from '@/types/app.types';

import { withoutProtocol } from '@/utils/url';
import { getDomains } from '@/data/providers';
import { getProviderDomain, getWellKnownOpenIdConfigUrl } from '@/app/provider-helpers';

interface ProviderDomainProps {
  provider: Provider;
}

export default async function ProviderDomain({ provider }: ProviderDomainProps) {
  const domains = await getDomains(provider.id);
  const domain = getProviderDomain(provider, domains);

  console.log('Provider Domain:', domain);
  return (
    <Link
      href={getWellKnownOpenIdConfigUrl(domain)}
      target="_blank"
      className="z-10 text-sm underline-offset-2 hover:underline"
    >
      {withoutProtocol(domain)}
    </Link>
  );
}
