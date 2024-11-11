import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Domain, Project } from '@/types/app.types';

interface CustomDomainsProps {
  project: Project;
  domains: Domain[];
}

export default function CustomDomains({ domains }: CustomDomainsProps) {
  return (
    <div>
      <div className="grid gap-2">
        {domains.map((domain) => (
          <Card key={domain.id}>
            <CardHeader>
              <CardTitle>{domain.domain}</CardTitle>
              <CardDescription className="sr-only">Custom domain: {domain.domain}</CardDescription>
            </CardHeader>
            <CardContent>
              <div key={domain.id}>{domain.domain}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
