import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/ui/card';

import LinkButton from './LinkButton';
import UnLinkButton from './UnLinkButton';

interface ConnectedAccountProps {
  accounts: { id: string; providerId: string }[];
}

const supportedProviders = [
  {
    provider: 'github',
    label: 'GitHub',
    icon: <SiGithub className="size-4" />,
  },
  {
    provider: 'google',
    label: 'Google',
    icon: <SiGoogle className="size-4" />,
  },
];

export default function ConnectedAccounts({ accounts }: ConnectedAccountProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected accounts</CardTitle>
        <CardDescription>Connect your account with 3rd party providers</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {supportedProviders.map((provider) => {
          const account = accounts.find((account) => account.providerId === provider.provider);

          return (
            <Card key={provider.provider} className="rounded-lg p-3 text-sm">
              <CardContent className="flex items-center p-0 px-2">
                <div className="flex items-center gap-2">
                  {provider.icon}
                  <span className="font-medium">{provider.label}</span>
                </div>
                <div className="ml-auto">
                  {account ? (
                    <UnLinkButton provider={provider} accountId={account.id} />
                  ) : (
                    <LinkButton provider={provider} />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
