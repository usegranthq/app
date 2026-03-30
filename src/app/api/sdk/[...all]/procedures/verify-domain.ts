import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import customDomain from '@/lib/domain';
import { getApiErrorMessage } from '@/utils/error';

import { authRpcRouter } from '../rpc';
import { domainFields } from './utils/return-fields';

const verifyDomain = authRpcRouter.providers.domains.verify.handler(async ({ context, input, errors }) => {
  const { providerId, domainId } = input;

  const plan = await getPlanByUserId(context.userId);

  if (!plan.features.customDomain.available) {
    throw errors.CUSTOM_DOMAINS_NOT_AVAILABLE();
  }

  // Check if provider exists
  const provider = await db.provider.findUnique({
    where: {
      id: providerId,
      userId: context.userId,
    },
  });

  if (!provider) {
    throw errors.PROVIDER_NOT_FOUND();
  }

  // check if domain exists
  const domain = await db.domain.findUnique({
    where: {
      id: domainId,
      providerId,
      Provider: {
        userId: context.userId,
      },
    },
    select: domainFields,
  });

  if (!domain) {
    throw errors.DOMAIN_NOT_FOUND();
  }

  try {
    const isVerified = await customDomain.verify(domain.domain);

    let updatedDomain = domain;
    if (domain.verified !== isVerified) {
      updatedDomain = await db.domain.update({
        where: {
          domain: domain.domain,
          providerId,
          Provider: {
            userId: context.userId,
          },
        },
        select: domainFields,
        data: { verified: isVerified },
      });
    }

    if (!isVerified) {
      return {
        verified: false,
        message: `Failed to verify domain.`,
        domain: null,
      };
    }

    return {
      verified: isVerified,
      message: 'Domain verified successfully',
      domain: {
        id: updatedDomain.id,
        domain: updatedDomain.domain,
        verified: updatedDomain.verified,
        createdAt: updatedDomain.createdAt,
        updatedAt: updatedDomain.updatedAt,
      },
    };
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Something went wrong');
    throw errors.INTERNAL_SERVER_ERROR({
      message: errorMessage,
    });
  }
});

export default verifyDomain;
