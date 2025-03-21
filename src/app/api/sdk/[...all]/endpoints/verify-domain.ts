import { getApiErrorMessage } from '@/utils/error';
import { tryDecode } from '@/utils/sanitize';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import vercel from '@/lib/vercel';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const verifyDomain = createAuthEndpoint(
  'v1/providers/:id/domains/:domain/verify',
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
        domain: tryDecode(ctx.params.domain),
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });

    if (!domain) {
      throw new SdkError('NOT_FOUND', ERRORS.DOMAIN_NOT_FOUND);
    }

    try {
      const verifyDomainResponse = await vercel.domains.verify(domain.domain);
      if (!verifyDomainResponse.verified) {
        return ['Failed to verify domain. Potentially configured with a different provider.', null];
      }

      const domainConfig = await vercel.domains.getConfig(domain.domain);
      const isVerified = verifyDomainResponse.verified && !domainConfig.misconfigured;

      await db.domain.update({
        where: {
          domain: domain.domain,
          providerId: ctx.params.id,
          Provider: {
            userId: ctx.context.userId,
          },
        },
        data: { verified: isVerified },
      });

      return {
        id: domain.id,
        domain: domain.domain,
        verified: isVerified,
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
