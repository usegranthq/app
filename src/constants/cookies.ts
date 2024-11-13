import { env } from '@/env';

export const AUTH_COOKIE = env.NODE_ENV === 'production' ? '__Secure-_ug.session_token' : '_ug.session_token';
export const VERIFY_COOKIE = '_ug.verify';
export const RECENT_PROJECT_COOKIE = '_ug.recent_project';
