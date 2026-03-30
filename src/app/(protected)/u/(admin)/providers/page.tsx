import { formatRelative } from 'date-fns';
import Link from 'next/link';

import { getProviders } from '@/data/providers';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Provider } from '@/types/app.types';

import NoProviders from './NoProviders';
import ProviderDomain from './ProviderDomain';

const ProviderCard = ({ provider }: { provider: Provider }) => {
  return (
    <Card className="relative flex h-44 flex-col hover:cursor-pointer hover:bg-muted/15">
      <CardHeader className="space-y-1">
        <CardTitle>{provider.name}</CardTitle>
        <CardDescription className="line-clamp-2">{provider.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-col items-start gap-0.5">
        <ProviderDomain provider={provider} />
        <div className="text-xs text-muted-foreground">
          last updated {formatRelative(new Date(provider.updatedAt), new Date())}
        </div>
      </CardFooter>
      <Link href={`/u/providers/${provider.id}`} className="absolute inset-0" />
    </Card>
  );
};

export default async function ProvidersPage() {
  const providers = await getProviders();

  if (providers.length === 0) {
    return <NoProviders />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Providers</h1>
        <Button asChild>
          <Link href="/u/providers/new">Create new provider</Link>
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
