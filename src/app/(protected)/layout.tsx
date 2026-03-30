import { headers } from 'next/headers';
import { PropsWithChildren } from 'react';

import Providers from '../Providers';
import NavHotkeys from './NavHotkeys';

export default async function ProtectedLayout({ children }: Readonly<PropsWithChildren>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') ?? '';

  return (
    <Providers nonce={nonce}>
      <NavHotkeys />
      {children}
    </Providers>
  );
}
