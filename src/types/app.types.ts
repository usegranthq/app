import { auth } from '@/lib/auth';
import { Provider, Token, Account, Session, Client, Domain, Customer, Subscription } from '@prisma/client';

export type { Provider, Token, Account, Session, Client, Domain, Customer, Subscription };

export type User = typeof auth.$Infer.Session.user;

// only returned from createToken api call
export type TokenWithToken = Omit<Token, 'token'> & {
  token: string;
};
