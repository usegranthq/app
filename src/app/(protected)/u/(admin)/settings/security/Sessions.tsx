import { getSessions } from '@/data/user';

import NoSessions from './NoSessions';
import SessionsList from './SessionsList';

export default async function Sessions() {
  const sessions = await getSessions();

  if (sessions.length === 0) {
    return <NoSessions />;
  }

  return <SessionsList sessions={sessions} />;
}
