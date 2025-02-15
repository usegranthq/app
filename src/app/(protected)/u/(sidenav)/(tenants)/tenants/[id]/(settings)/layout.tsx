import { PropsWithChildren } from 'react';

export default function TenantSettingsLayout({ children }: PropsWithChildren) {
  return <div className="mx-auto max-w-4xl px-4 py-10">{children}</div>;
}
