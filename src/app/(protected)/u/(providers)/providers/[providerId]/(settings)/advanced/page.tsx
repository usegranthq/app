import { notFound } from 'next/navigation';

import { getProvider } from '@/data/providers';
import { getDefaultDomain } from '@/app/provider-helpers';
import { getPlanDetails } from '@/data/user';

import SigningKeys from './SigningKeys';

interface AdvancedPageProps {
  params: Promise<{
    providerId: string;
  }>;
}

export default async function AdvancedPage({ params }: AdvancedPageProps) {
  const { providerId } = await params;
  const provider = await getProvider(providerId);

  if (!provider) {
    return notFound();
  }

  const plan = await getPlanDetails();
  const jwksUrl = getDefaultDomain(provider.urlId, '/.well-known/jwks');

  return (
    <div className="flex flex-col gap-8">
      <SigningKeys provider={provider} jwksUrl={jwksUrl} canRotateSigningKey={plan.rotateSigningKey} />
    </div>
  );
}
