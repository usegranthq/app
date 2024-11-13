'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Domain, Project } from '@/types/app.types';
import { deleteDomain, verifyDomain } from '@/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSubdomain } from '@/utils/url';

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
      {!isVerified && (
        <CardContent>
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
        </CardContent>
      )}
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
