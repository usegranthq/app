'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface CopyButtonProps extends PropsWithChildren {
  text: string;
  label: string;
  copiedLabel: string;
  className?: string;
  labelClassName?: string;
}

export default function CopyButton(props: CopyButtonProps) {
  const { text, label, copiedLabel, className, labelClassName, children } = props;
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {children}
      <span className={labelClassName}>{copied ? copiedLabel : label}</span>
    </button>
  );
}
