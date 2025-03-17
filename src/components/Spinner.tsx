import { LoaderIcon } from 'lucide-react';

import { cn } from '@/shadcn/lib/utils';

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps) {
  return <LoaderIcon className={cn('size-4 animate-spin', className)} />;
}
