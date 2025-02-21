import { PropsWithChildren } from 'react';

import { env } from '@/env';

import Providers from '../Providers';

export default function NotProtectedLayout({ children }: Readonly<PropsWithChildren>) {
  return <Providers nonce={env.BUILD_HASH}>{children}</Providers>;
}
