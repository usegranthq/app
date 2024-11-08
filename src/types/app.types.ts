import { auth } from '@/lib/auth';
import { Project, Token, Account, Session, Client } from '@prisma/client';

export type { Project, Token, Account, Session, Client };

export type User = typeof auth.$Infer.Session.user;

// only returned from createToken api call
export type TokenWithToken = Omit<Token, 'token'> & {
  token: string;
};
