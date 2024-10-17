import api from '@/lib/api';
import { Session } from '@/types/app.types';

import NoSessions from './NoSessions';
import SessionsList from './SessionsList';

export default async function Sessions() {
  const sessions = await api.get<Session[]>('v1/u/settings/sessions').json();

  if (sessions.length === 0) {
    return <NoSessions />;
  }

  return <SessionsList sessions={sessions} />;
}
