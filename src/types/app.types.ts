import {
  Account,
  Client,
  Customer,
  Domain,
  Apikey as PrismaApikey,
  Provider,
  Session,
  Subscription,
  Tenant,
  TenantProvider,
} from '@prisma/client';

import { auth } from '@/lib/auth';

export type { Provider, Account, Session, Client, Domain, Customer, Subscription, Tenant, TenantProvider };

export type User = typeof auth.$Infer.Session.user;
export type ApiKey = Omit<PrismaApikey, 'key'>;
