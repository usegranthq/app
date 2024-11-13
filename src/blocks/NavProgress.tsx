'use client';

import { AnimatePresence, domAnimation, LazyMotion, motion, useMotionTemplate, useSpring } from 'framer-motion';
import { PropsWithChildren, createContext, startTransition, useContext, useEffect, useOptimistic } from 'react';
import { useRouter } from 'next/navigation';
import { useInterval } from 'usehooks-ts';

import { cn } from '@/lib/utils';

const ProgressBarContext = createContext<ReturnType<typeof useProgress> | null>(null);

export function useProgressBar() {
  const progress = useContext(ProgressBarContext);

  if (progress === null) {
    throw new Error('useProgressBar must be used within a ProgressBarContext.Provider');
  }

  return progress;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDiff(current: number): number {
  let diff;
  if (current === 0) {
    diff = 15;
  } else if (current < 50) {
    diff = rand(1, 10);
  } else {
    diff = rand(1, 5);
  }

  return diff;
}

function useProgress() {
  const [loading, setLoading] = useOptimistic<boolean>(false);

  const value = useSpring(0, {
    damping: 25,
    mass: 0.5,
    stiffness: 300,
    restDelta: 0.1,
  });

  useInterval(
    () => {
      const current = value.get();
      value.set(Math.min(current + getDiff(current), 99));
    },
    loading ? 750 : null,
  );

  useEffect(() => {
    if (!loading) {
      return value.jump(100);
    }

    value.set(getDiff(0));
  }, [value, loading]);

  function start() {
    value.jump(0);
    setLoading(true);
  }

  return { value, start, loading };
}

interface ProgressIndicatorProps {
  className?: string;
}

function ProgressIndicator({ className }: ProgressIndicatorProps) {
  const router = useRouter();
  const progress = useProgressBar();
  const width = useMotionTemplate`${progress.value}%`;

  useEffect(() => {
    if (router.push.name === 'patched') return;

    const originalPush = router.push;

    router.push = async (...args) => {
      startTransition(() => {
        progress.start();
        originalPush(...args);
      });
    };

    return () => {
      router.push = originalPush;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {progress.loading && (
          <motion.div
            style={{ width }}
            exit={{ opacity: 0 }}
            className={cn('fixed inset-x-0 top-0 z-50 h-[2px] bg-primary', className)}
          />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

interface ProgressProviderProps extends PropsWithChildren {
  className?: string;
}

export default function LoadingProgress({ children, className }: ProgressProviderProps) {
  const progress = useProgress();

  return (
    <ProgressBarContext.Provider value={progress}>
      <ProgressIndicator className={className} />
      {children}
    </ProgressBarContext.Provider>
  );
}
