'use client';

import { useEffect } from 'react';
import { RECENT_PROJECT_COOKIE } from '@/constants';

interface RecentProjectTrackerProps {
  projectId: string;
}

export default function RecentProjectTracker({ projectId }: RecentProjectTrackerProps) {
  useEffect(() => {
    document.cookie = `${RECENT_PROJECT_COOKIE}=${projectId}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }, [projectId]);

  return null;
}
