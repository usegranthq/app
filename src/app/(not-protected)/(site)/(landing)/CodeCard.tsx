import { ReactNode } from 'react';

import { cn } from '@/shadcn/lib/utils';

import CopyButton from '../CopyButton';
import { mono } from '../styles';

// k: keyword, s: string, f: function, c: comment, p: plain
export type CodeToken = [kind: 'k' | 's' | 'f' | 'c' | 'p', text: string];
export type CodeLine = { indent?: boolean; tokens: CodeToken[] };

const tokenClasses: Record<CodeToken[0], string> = {
  k: 'text-(--accent)',
  s: 'text-[#e9c98b]',
  f: 'text-white',
  c: 'text-[#858585]',
  p: '',
};

const toText = (lines: CodeLine[]) =>
  lines.map((line) => (line.indent ? '  ' : '') + line.tokens.map(([, text]) => text).join('')).join('\n');

interface CodeCardProps {
  filename: string;
  lines: CodeLine[];
  footer?: ReactNode;
}

export default function CodeCard({ filename, lines, footer }: CodeCardProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded border border-white/10 bg-[#0e0e0e]">
      <div className="flex items-center justify-between border-b border-white/8">
        <span
          className={cn(
            mono,
            'border-r border-white/8 px-4 py-3 text-xs text-[#ededed] shadow-[inset_0_-1px_0_var(--accent)]',
          )}
        >
          {filename}
        </span>
        <CopyButton
          text={toText(lines)}
          label="Copy"
          copiedLabel="Copied"
          className={cn(
            mono,
            'mr-2.5 cursor-pointer rounded-[2px] border border-white/12 bg-transparent px-2.5 py-1.5 text-[11px] tracking-[.06em] text-[#a3a3a3] uppercase hover:border-white/30 hover:text-[#ededed]',
          )}
        />
      </div>
      <div className={cn(mono, 'overflow-x-auto py-5 text-xs leading-[1.75] text-[#d4d4d4]')}>
        <div className="grid grid-cols-[36px_max-content] whitespace-pre">
          {lines.map((line, i) => (
            <div key={i} className="contents">
              <span className="pr-3 text-right text-[#4a4a4a]">{i + 1}</span>
              <div className={cn({ 'pl-[2ch]': line.indent })}>
                {line.tokens.length === 0
                  ? ' '
                  : line.tokens.map(([kind, text], j) => (
                      <span key={j} className={tokenClasses[kind]}>
                        {text}
                      </span>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {footer}
    </div>
  );
}
