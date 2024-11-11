'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Domain, Project } from '@/types/app.types';
import { deleteDomain } from '@/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CustomDomainsProps {
  project: Project;
  domains: Domain[];
}

const DeleteButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" variant="destructive" type="submit" disabled={pending}>
      Remove
    </Button>
  );
};

const DomainCard = ({ domain }: { domain: Domain }) => {
  const handleDelete = async () => {
    const yes = confirm('Are you sure you want to remove this domain?');
    if (!yes) return;

    const [errorMessage] = await deleteDomain(domain.projectId, domain.domain);
    if (errorMessage) {
      toast.error(errorMessage);
    }
  };

  return (
    <Card key={domain.id}>
      <CardHeader className="flex flex-row">
        <div>
          <CardTitle>{domain.domain}</CardTitle>
          <CardDescription className="sr-only">Custom domain: {domain.domain}</CardDescription>
          <Badge variant="outline" className="mt-4">
            {domain.verified ? 'Verified' : 'Pending'}
          </Badge>
        </div>
        <form className="ml-auto" action={handleDelete}>
          <DeleteButton />
        </form>
      </CardHeader>
      <CardContent>
        <div key={domain.id}>{domain.domain}</div>
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
