import { notFound } from 'next/navigation';

import { getProvider } from '@/data/providers';

import SigningKeys from './SigningKeys';

export default async function AdvancedPage(props: PageProps<'/u/providers/[id]'>) {
  const { id } = await props.params;
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
