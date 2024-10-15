'use client';

import { SWRConfig } from 'swr';
import clientApi from '@/lib/api/client';

export default function SWR({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ revalidateOnFocus: false, fetcher: clientApi.get }}>{children}</SWRConfig>;
}
