'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Domain, Project } from '@/types/app.types';
import { deleteDomain, verifyDomain } from '@/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSubdomain } from '@/utils/url';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

interface CustomDomainsProps {
  project: Project;
  domains: Domain[];
}

const VerifyButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" variant="outline" type="submit" disabled={pending}>
      {pending ? 'Verifying...' : 'Verify'}
    </Button>
  );
};

const DeleteButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" variant="outline" type="submit" disabled={pending}>
      Remove
    </Button>
  );
};

const DomainCard = ({ domain }: { domain: Domain }) => {
  const handleVerify = async () => {
    const [errorMessage, isVerified] = await verifyDomain(domain.projectId, domain.domain);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    if (!isVerified) {
      toast.error('Failed to verify domain. Check your DNS configuration.');
      return;
    }

    toast.success('Domain verified successfully.');
  };

  const handleDelete = async () => {
    const yes = confirm('Are you sure you want to remove this domain?');
    if (!yes) return;

    const [errorMessage] = await deleteDomain(domain.projectId, domain.domain);
    if (errorMessage) {
      toast.error(errorMessage);
    }

    toast.success('Domain removed successfully.');
  };

  const isVerified = domain.verified;

  const isApexDomain = domain.domain.split('.').length === 2;
  const domainRecord = isApexDomain ? domain.domain : getSubdomain(domain.domain);

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
            <VerifyButton />
          </form>
          <form action={handleDelete}>
            <DeleteButton />
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
                    <th className="text-left">Name</th>
                    <th className="text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-10 pt-2">{isApexDomain ? 'A' : 'CNAME'}</td>
                    <td className="pr-10 pt-2">{domainRecord}</td>
                    <td className="pr-10 pt-2">{isApexDomain ? '76.76.21.21' : 'cname.usegrant.dev'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
