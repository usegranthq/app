'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { cn } from '@/shadcn/lib/utils';

import { mono } from '../styles';

const FINAL_STEP = 4;

const NODES = [
  { name: 'your-service', detail: "sdk.createToken('providerId', 'clientId')" },
  { name: 'usegrant.dev', detail: 'trusted identity provider · issues accessToken' },
  { name: 'aws sts', detail: 'AssumeRoleWithWebIdentity' },
];

const LOGS = [
  { t: '00:00.000', text: 'POST /v1/providers/:id/clients/:id/tokens' },
  { t: '00:00.041', text: '201  accessToken issued' },
  { t: '00:00.042', text: 'sts:AssumeRoleWithWebIdentity' },
  { t: '00:00.188', text: '✓ role assumed · SessionName', success: true },
];

export default function TokenFlow() {
  const [tick, setTick] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const timer = setInterval(() => setTick((t) => (t + 1) % 6), 1300);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  // the last two ticks hold the completed state before restarting
  const step = reduceMotion ? FINAL_STEP : Math.min(tick, FINAL_STEP);
  const isActive = (i: number) => step === i || (step === FINAL_STEP && i === NODES.length - 1);

  return (
    <div className="min-w-0 rounded border border-white/10 bg-[#0e0e0e] shadow-[0_40px_80px_-40px_rgba(0,0,0,.9)]">
      <div
        className={cn(
          mono,
          'flex items-center justify-between border-b border-white/8 px-4 py-3 text-[11px] tracking-[.06em] text-[#8a8a8a] uppercase',
        )}
      >
        <span>token exchange</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-(--accent)" />
          live
        </span>
      </div>
      <div className="flex flex-col p-5">
        {NODES.map((node, i) => (
          <div key={node.name} className="contents">
            {i > 0 && (
              <div
                className={cn(
                  'ml-[27px] h-7 w-px transition-colors duration-300',
                  step >= i ? 'bg-(--accent)' : 'bg-white/10',
                )}
              />
            )}
            <div
              className={cn(
                'grid grid-cols-[auto_1fr] items-center gap-x-3.5 gap-y-1 rounded-[2px] border px-4 py-3.5 transition-all duration-300',
                isActive(i) ? 'border-(--accent) bg-[rgba(198,244,50,.04)]' : 'border-white/10 bg-transparent',
              )}
            >
              <span className={cn(mono, 'text-[11px] text-[#6f6f6f]')}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[15px] font-semibold">{node.name}</span>
              <span />
              <span className={cn(mono, 'text-xs wrap-anywhere text-[#a3a3a3]')}>{node.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={cn(mono, 'border-t border-white/8 px-5 pt-4 pb-[18px] text-xs leading-[1.9]')}>
        {/* every row is always rendered (hidden until reached) so the card height never shifts */}
        {[...LOGS, null].map((log, i) => {
          if (i === step) {
            return (
              <div key={i}>
                <span className="inline-block h-[13px] w-[7px] animate-[ug-blink_1s_steps(1)_infinite] bg-[#a3a3a3] align-middle motion-reduce:animate-none" />
              </div>
            );
          }

          return (
            <div key={i} className={cn('flex min-w-0 gap-3', { invisible: i > step })}>
              <span className="text-[#5c5c5c]">{log?.t ?? '\u00a0'}</span>
              <span className={cn('wrap-anywhere', log?.success ? 'text-(--accent)' : 'text-[#d4d4d4]')}>
                {log?.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
