'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Badge } from '@/shadcn/components/ui/badge';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import { deleteDomain, verifyDomain } from '@/actions';
import { useProgressBar } from '@/components/NavProgress';
import { Domain, Provider } from '@/types/app.types';

interface CustomDomainsProps {
  provider: Provider;
  domains: Domain[];
}

interface ActionButtonProps {
  isLoading: boolean;
}

const VerifyButton = ({ isLoading }: ActionButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" variant="outline" type="submit" disabled={pending || isLoading}>
      {pending ? 'Verifying...' : 'Verify'}
    </Button>
  );
};

const DeleteButton = ({ isLoading }: ActionButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" variant="outline" type="submit" disabled={pending || isLoading}>
      Remove
    </Button>
  );
};

const DomainCard = ({ domain }: { domain: Domain }) => {
  const [isPending, startTransition] = useTransition();
  const progress = useProgressBar();

  const handleVerify = async () => {
    startTransition(async () => {
      progress.start();
      const [errorMessage, isVerified] = await verifyDomain(domain.providerId, domain.domain);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      if (!isVerified) {
        toast.error('Failed to verify domain. Check your DNS configuration with your provider.');
        return;
      }

      toast.success('Domain verified successfully.');
    });
  };

  const handleDelete = async () => {
    const yes = confirm('Are you sure you want to remove this domain?');
    if (!yes) return;

    startTransition(async () => {
      progress.start();
      const [errorMessage] = await deleteDomain(domain.providerId, domain.domain);
      if (errorMessage) {
        toast.error(errorMessage);
      }

      toast.success('Domain removed successfully.');
    });
  };

  const isVerified = domain.verified;
  const isApexDomain = domain.domain.split('.').length === 2;

  return (
    <Card key={domain.id}>
      <CardHeader className="flex flex-row">
        <div>
          <CardTitle>{domain.domain}</CardTitle>
          <CardDescription className="sr-only">Custom domain: {domain.domain}</CardDescription>
          <Badge variant={isVerified ? 'default' : 'secondary'} className="mt-4">
            {isVerified ? 'Verified' : 'Misconfigured'}
          </Badge>
        </div>
        <div className="ml-auto flex gap-2">
          <form action={handleVerify}>
            <VerifyButton isLoading={isPending} />
          </form>
          <form action={handleDelete}>
            <DeleteButton isLoading={isPending} />
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {!isVerified && (
          <>
            <p className="text-sm">
              Domain verification is required to use this domain. Set the following records on your DNS provider to
              continue:
            </p>
            <div className="mt-4 rounded-md bg-muted p-2">
              <table className="text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Type</th>
                    <th className="text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-10 pt-2">{isApexDomain ? 'ALIAS/ANAME/Flattended CNAME' : 'CNAME'}</td>
                    <td className="pr-10 pt-2">{isApexDomain ? 'apex.usegrant.dev' : 'cname.usegrant.dev'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm">
              Add an ALIAS, ANAME, or flattened CNAME record. Depending on your provider, leave the host field empty or
              enter `@`.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="text-sm text-destructive">*</span>For cloudflare users, disable the proxy(orange cloud)
              for the domain and set the records above.
            </p>
          </>
        )}
        {isVerified && (
          <div className="flex items-center gap-4 text-sm">
            <Link
              href={`https://${domain.domain}/.well-known/openid-configuration`}
              className="flex items-center gap-1 underline-offset-4 hover:underline"
              target="_blank"
            >
              <ExternalLinkIcon className="size-4" /> OpenId Configuration
            </Link>
            <Link
              href={`https://${domain.domain}/.well-known/jwks`}
              className="flex items-center gap-1 underline-offset-4 hover:underline"
              target="_blank"
            >
              <ExternalLinkIcon className="size-4" /> Jwks
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function CustomDomains({ domains }: CustomDomainsProps) {
  return (
    <div>
      <div className="grid gap-2">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}
