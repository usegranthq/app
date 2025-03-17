'use client';

import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';

export default function ErrorComponent() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center p-4">
      <AlertOctagon className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-4 text-center font-mono text-4xl font-bold">Oops! Something went wrong</h1>
      <p className="mb-8 max-w-md text-center text-sm font-medium text-muted-foreground">
        It seems our digital realm encountered an issue. Please try reloading the page. If the problem continues,
        contact support at{' '}
        <Link href="mailto:support@usegrant.dev" className="hover:underline">
          support@usegrant.dev
        </Link>
        .
      </p>
      <Button className="flex items-center gap-2 px-8 font-mono" onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </div>
  );
}
