import { auth } from '@/lib/auth';
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
  TenantProviderPolicy,
} from '@/prisma/client';

export type {
  Provider,
  Account,
  Session,
  Client,
  Domain,
  Customer,
  Subscription,
  Tenant,
  TenantProvider,
  TenantProviderPolicy,
};

export type User = typeof auth.$Infer.Session.user;
export type ApiKey = Omit<PrismaApikey, 'key'>;
