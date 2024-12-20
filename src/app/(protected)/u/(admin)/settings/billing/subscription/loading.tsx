import Spinner from '@/blocks/Spinner';

export default function Loading() {
  return (
    <div className="flex h-44 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <h1 className="font-mono font-bold tracking-wider">Fetching your subscription status...</h1>
      </div>
    </div>
  );
}
