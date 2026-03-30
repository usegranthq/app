import type * as BetterAuthTypes from 'better-auth';

import { auth } from '@/lib/auth';
import {
  Client,
  Customer,
  Domain,
  Apikey as PrismaApikey,
  Provider,
  Subscription,
  Tenant,
  TenantProvider,
  TenantProviderPolicy,
} from '@/prisma/client';

type Session = BetterAuthTypes.Session;
export type { Provider, Session, Client, Domain, Customer, Subscription, Tenant, TenantProvider, TenantProviderPolicy };

export type User = BetterAuthTypes.User<(typeof auth.options)['user'], (typeof auth.options)['plugins']>;
export type ApiKey = Omit<PrismaApikey, 'key'>;
