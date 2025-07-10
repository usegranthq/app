'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';

import { Domain } from '@/types/app.types';

import { withoutProtocol } from '@/utils/url';
import { getCaDetails } from '@/actions/ca';
import Spinner from '@/components/Spinner';

interface CaDetailsProps {
  domains: Domain[];
  defaultDomain: string;
  defaultDomainHostname: string;
}

interface CaDetails {
  domain: string;
  issuer: string;
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

const toSelectOption = (domain: string) => ({
  label: domain,
  value: domain,
});

export default function CaDetails(props: CaDetailsProps) {
  const { domains, defaultDomain, defaultDomainHostname } = props;
  const [selectedDomain, setSelectedDomain] = useState(defaultDomainHostname);
  const [caDetails, setCaDetails] = useState<CaDetails | null>(null);

  const domainsOptions = useMemo(() => {
    return [
      toSelectOption(defaultDomainHostname),
      ...domains
        .filter((domain) => domain.verified)
        .map((domain) => domain.domain)
        .map(toSelectOption),
    ];
  }, [defaultDomainHostname, domains]);

  useEffect(() => {
    const hasDomain = domainsOptions.some((domain) => domain.value === selectedDomain);
    if (!hasDomain) {
      setSelectedDomain(defaultDomainHostname);
      setCaDetails(null);
    }
  }, [defaultDomainHostname, domainsOptions, selectedDomain]);

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
      issuer: ca.issuer,
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
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Your default provider&apos;s domain is{' '}
              <Link
                href={`${defaultDomain}/.well-known/openid-configuration`}
                target="_blank"
                className="font-bold hover:underline"
              >
                {withoutProtocol(defaultDomain)}
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-sm text-muted-foreground">Note: Self signed certificates are not supported.</p>
            <form className="flex flex-col gap-2" action={formAction}>
              <Label>Select Domain</Label>
              <div className="flex items-center gap-4">
                <Select value={selectedDomain ?? ''} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="max-w-lg min-w-64">
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
                    <Label>Issuer</Label>
                    <Input name="ca" readOnly disabled value={caDetails.issuer} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Thumbprint</Label>
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
