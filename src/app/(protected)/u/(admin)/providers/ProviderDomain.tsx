import Link from 'next/link';

import { getDomains } from '@/data/providers';
import { getProviderDomain, getWellKnownOpenIdUrl } from '@/app/provider-helpers';
import { Provider } from '@/types/app.types';

interface ProviderDomainProps {
  provider: Provider;
}

export default async function ProviderDomain({ provider }: ProviderDomainProps) {
  const domains = await getDomains(provider.id);
  const domain = getProviderDomain(provider, domains);

  return (
    <Link
      href={getWellKnownOpenIdUrl(domain)}
      target="_blank"
      className="z-10 text-sm underline-offset-2 hover:underline"
    >
      {domain}
    </Link>
  );
}
