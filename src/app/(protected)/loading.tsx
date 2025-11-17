import Spinner from '@/components/Spinner';

export default function UserLoading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <h1 className="font-mono font-bold tracking-wider">Just a sec, we're setting things up...</h1>
      </div>
    </div>
  );
}
