'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';

export default function CopyInput({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Input type="text" readOnly value={value} />
      <Button type="button" size="icon" variant="secondary" onClick={handleCopy}>
        {copied ? <CopyCheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}
