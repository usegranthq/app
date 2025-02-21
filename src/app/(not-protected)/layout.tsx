import { PropsWithChildren } from 'react';

import Providers from '../Providers';

export default function NotProtectedLayout({ children }: Readonly<PropsWithChildren>) {
  return <Providers nonce={''}>{children}</Providers>;
}
