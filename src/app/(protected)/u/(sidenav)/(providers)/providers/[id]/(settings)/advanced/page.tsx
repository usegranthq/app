import { notFound } from 'next/navigation';

import { getProvider } from '@/data/providers';

import SigningKeys from './SigningKeys';

interface AdvancedPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdvancedPage({ params }: AdvancedPageProps) {
  const { id } = await params;
  const provider = await getProvider(id);

  if (!provider) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <SigningKeys provider={provider} />
    </div>
  );
}
