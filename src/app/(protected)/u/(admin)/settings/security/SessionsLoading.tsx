import { Skeleton } from '@/components/ui/skeleton';

const LoadingRow = () => (
  <div className="flex items-center justify-between pt-4">
    <div>
      <Skeleton className="h-2.5 w-12 rounded-full" />
    </div>
    <div>
      <Skeleton className="h-2.5 w-12 rounded-full" />
    </div>
    <div>
      <Skeleton className="h-2.5 w-12 rounded-full" />
    </div>
  </div>
);

interface SessionsLoadingProps {
  rows?: number;
}

export default function SessionsLoading({ rows = 5 }: SessionsLoadingProps) {
  return (
    <div role="status" className="space-y-4 divide-y divide-border rounded border border-border p-4 shadow">
      {[...Array(rows)].map((_, index) => (
        <LoadingRow key={`skeleton-${index}`} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
