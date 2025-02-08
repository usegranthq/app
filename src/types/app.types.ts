import {
  Account,
  Client,
  Customer,
  Domain,
  Provider,
  Session,
  Subscription,
  Tenant,
  TenantProvider,
  Token,
} from '@prisma/client';

import { auth } from '@/lib/auth';

export type { Provider, Token, Account, Session, Client, Domain, Customer, Subscription, Tenant, TenantProvider };

export type User = typeof auth.$Infer.Session.user;

// only returned via createToken api call, otherwise tokens are not returned
export type TokenWithToken = Omit<Token, 'token'> & {
  token: string;
};
