import { FingerprintIcon } from 'lucide-react';

export default function NoSessions() {
  return (
    <div className="flex h-44 items-center justify-center">
      <div className="flex flex-col items-center">
        <FingerprintIcon className="size-10 text-muted-foreground" />
        <h2 className="mt-2 text-lg font-semibold">No sessions found</h2>
        <p className="text-sm text-muted-foreground">You don&apos;t have any sessions other than this.</p>
      </div>
    </div>
  );
}
