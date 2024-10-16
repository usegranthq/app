import { KeyRoundIcon } from 'lucide-react';

export default function NoTokens() {
  return (
    <div className="flex h-44 items-center justify-center">
      <div className="flex flex-col items-center">
        <KeyRoundIcon className="size-10 text-muted-foreground" />
        <h2 className="mt-2 text-lg font-semibold">No tokens found</h2>
        <p className="text-sm text-muted-foreground">You don&apos;t have any tokens yet. Create one to get started.</p>
      </div>
    </div>
  );
}
