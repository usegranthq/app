import NoSessions from './NoSessions';
import SessionsList from './SessionsList';
import { getSessions } from '@/dal/user';

export default async function Sessions() {
  const sessions = await getSessions();

  if (sessions.length === 0) {
    return <NoSessions />;
  }

  return <SessionsList sessions={sessions} />;
}
