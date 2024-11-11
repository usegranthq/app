import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps) {
  return <LoaderIcon className={cn('size-4 animate-spin', className)} />;
}
