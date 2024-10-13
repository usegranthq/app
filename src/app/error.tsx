'use client';

import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';
import Link from 'next/link';

export default function ErrorComponent() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center p-4">
      <AlertOctagon className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-4xl font-bold mb-4 text-center font-mono">Oops! Something went wrong</h1>
      <p className="text-muted-foreground text-sm font-medium mb-8 text-center max-w-md">
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
