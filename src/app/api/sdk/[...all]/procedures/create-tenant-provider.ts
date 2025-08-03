import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';

import { authRpcRouter } from '../rpc';
import { tenantProviderFields } from './utils/return-fields';

const createTenantProvider = authRpcRouter.tenants.providers.create.handler(async ({ context, input, errors }) => {
  const { tenantId, url, fingerprints, audience, earliestIssuanceTimeAllowed } = input;

  // Check if tenant exists
  const tenant = await db.tenant.findUnique({
    where: {
      id: tenantId,
      userId: context.userId,
    },
  });

  if (!tenant) {
    throw errors.TENANT_NOT_FOUND();
  }

  const plan = await getPlanByUserId(context.userId);
  const tenantsCount = await db.tenantProvider.count({
    where: {
      tenantId,
      Tenant: {
        userId: context.userId,
      },
    },
  });

  if (tenantsCount >= plan.features.tenantProviders.limit) {
    throw errors.MAX_TENANT_PROVIDERS_LIMIT_REACHED();
  }

  // check if tenant already exists
  const tenantProviderExists = await db.tenantProvider
    .count({
      where: {
        tenantId,
        url: {
          equals: url,
          mode: 'insensitive',
        },
        Tenant: {
          userId: context.userId,
        },
      },
    })
    .then(Boolean);

  if (tenantProviderExists) {
    throw errors.TENANT_PROVIDER_ALREADY_EXISTS();
  }

  const tenantProvider = await db.tenantProvider.create({
    data: {
      tenantId,
      url,
      fingerprints,
      audience,
      earliestIssuanceTimeAllowed,
    },
    select: tenantProviderFields,
  });

  return tenantProvider;
});

export default createTenantProvider;
