import { PropsWithChildren } from 'react';
import { headers } from 'next/headers';

import Providers from '../Providers';

export default async function ProtectedLayout({ children }: Readonly<PropsWithChildren>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') ?? '';

  return <Providers nonce={nonce}>{children}</Providers>;
}
