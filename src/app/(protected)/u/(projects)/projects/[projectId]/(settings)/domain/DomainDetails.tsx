import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const domainDetails = {
  domain: 'example.auth.usegrant.dev',
  ca: 'LetsEncrypt',
  fingerprint: 'E0:61:8D:56:4D:8E:35:4D:1A:DA:5B:2D:26:3A:02:8C:5A:8A:3D:2A',
};

export default function DomainDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Domain</CardTitle>
        <CardDescription>
          Below are the details of your project&apos;s domain and its Certificate Authority (CA) thumbprint.
        </CardDescription>
      </CardHeader>
      <div>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label>Domain Name</Label>
              <Input name="domain" readOnly disabled value={domainDetails.domain} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Certificate Authority (CA)</Label>
              <Input name="ca" readOnly disabled value={domainDetails.ca} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Top Intermediate CA Thumbprint</Label>
              <Input name="fingerprint" readOnly disabled value={domainDetails.fingerprint} />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
