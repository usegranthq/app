import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import customDomain from '@/lib/domain';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';
import { domainFields } from './utils/return-fields';

const addDomain = authRpcRouter.providers.domains.add.handler(async ({ context, input, errors }) => {
  const plan = await getPlanByUserId(context.userId);

  if (!plan.features.customDomain.available) {
    throw errors.CUSTOM_DOMAINS_NOT_AVAILABLE();
  }

  // Check if provider exists
  const provider = await db.provider.findUnique({
    where: {
      id: input.providerId,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  const existingDomains = await db.domain.findMany({
    where: {
      providerId: input.providerId,
      Provider: {
        userId: context.userId,
      },
    },
  });

  // check if domain is already added
  const isDomainAlreadyAdded = existingDomains.some((domain) => domain.domain === input.domain);
  if (isDomainAlreadyAdded) {
    throw errors.DOMAIN_ALREADY_ADDED();
  }

  // get existing domains, don't allow more than plan limit
  if (existingDomains.length >= plan.features.customDomain.limit) {
    throw errors.MAX_DOMAINS_LIMIT_REACHED();
  }

  try {
    const extDomain = await customDomain.add(input.domain);
    const domain = await db.domain.create({
      data: {
        domain: input.domain,
        verified: extDomain.verified,
        providerId: input.providerId,
        externalId: extDomain.id,
      },
      select: domainFields,
    });

    return {
      id: domain.id,
      domain: domain.domain,
      verified: domain.verified,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');

    throw errors.INTERNAL_SERVER_ERROR({
      message: errorMessage,
    });
  }
});

export default addDomain;
