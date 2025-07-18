import { getApiErrorMessage } from '@/utils/error';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import customDomain from '@/lib/domain';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { domainFields } from './utils/return-fields';

const verifyDomain = createAuthEndpoint(
  'v1/providers/:id/domains/:domainId/verify',
  {
    method: 'POST',
  },
  async (ctx) => {
    const plan = await getPlanByUserId(ctx.context.userId);

    if (!plan.features.customDomain.available) {
      throw new SdkError('FORBIDDEN', ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE);
    }

    // Check if provider exists
    const provider = await db.provider.findUnique({
      where: {
        id: ctx.params.id,
        userId: ctx.context.userId,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    // check if domain exists
    const domain = await db.domain.findUnique({
      where: {
        id: ctx.params.domainId,
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
      select: domainFields,
    });

    if (!domain) {
      throw new SdkError('NOT_FOUND', ERRORS.DOMAIN_NOT_FOUND);
    }

    try {
      const isVerified = await customDomain.verify(domain.domain);

      let updatedDomain = domain;
      if (domain.verified !== isVerified) {
        updatedDomain = await db.domain.update({
          where: {
            domain: domain.domain,
            providerId: ctx.params.id,
            Provider: {
              userId: ctx.context.userId,
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
        domain: updatedDomain,
      };
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');
      return new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default verifyDomain;
