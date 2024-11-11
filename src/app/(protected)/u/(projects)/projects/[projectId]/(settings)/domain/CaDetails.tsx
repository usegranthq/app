'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Domain, Project } from '@/types/app.types';
import { getCaDetails } from '@/actions/ca';
import { Button } from '@/components/ui/button';
import Spinner from '@/blocks/Spinner';

interface CADetailsProps {
  project: Project;
  defaultDomain: string;
  domains: Domain[];
}

interface CADetails {
  domain: string;
  name: string;
  thumbprint: string;
}

const FetchButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {pending && <Spinner />}
      {pending ? 'Retrieving CA info...' : 'Retrieve CA info'}
    </Button>
  );
};

const getHostname = (domain: string) => {
  return new URL(domain).hostname;
};

export default function CADetails({ defaultDomain, domains }: CADetailsProps) {
  const [selectedDomain, setSelectedDomain] = useState(getHostname(defaultDomain));
  const [caDetails, setCaDetails] = useState<CADetails | null>(null);

  const domainsOptions = useMemo(() => {
    const defaultHostname = getHostname(defaultDomain);
    return [
      {
        label: defaultHostname,
        value: defaultHostname,
      },
      ...domains.map((domain) => ({
        label: domain.domain,
        value: domain.domain,
      })),
    ];
  }, [defaultDomain, domains]);

  useEffect(() => {
    const hasDomain = domainsOptions.some((domain) => domain.value === selectedDomain);
    if (!hasDomain) {
      setSelectedDomain(getHostname(defaultDomain));
    }
  }, [defaultDomain, domainsOptions, selectedDomain]);

  const formAction = async () => {
    setCaDetails(null);

    if (!selectedDomain) {
      toast.warning('Please select a domain to retrieve details');
      return;
    }

    const [errorMessage, ca] = await getCaDetails(selectedDomain);
    if (errorMessage || !ca) {
      toast.error(errorMessage);
      return;
    }

    setCaDetails({
      domain: selectedDomain,
      name: ca.name,
      thumbprint: ca.thumbprint,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Authority (CA) Details</CardTitle>
        <CardDescription>Select a domain to retrieve its Certificate Authority (CA) information.</CardDescription>
      </CardHeader>
      <div>
        <CardContent>
          <div className="flex flex-col gap-8">
            <form className="flex flex-col gap-2" action={formAction}>
              <Label>Select Domain</Label>
              <div className="flex items-center gap-4">
                <Select value={selectedDomain ?? ''} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="max-w-lg">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {domainsOptions.map((domain) => (
                        <SelectItem key={domain.value} value={domain.value}>
                          {domain.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FetchButton />
              </div>
            </form>
            {caDetails !== null && (
              <div>
                <div className="my-4 flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label>Certificate Authority (CA)</Label>
                    <Input name="ca" readOnly disabled value={caDetails.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Top Intermediate CA Thumbprint</Label>
                    <Input name="fingerprint" readOnly disabled value={caDetails.thumbprint} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
