import { z } from 'zod';

import { getApiErrorMessage } from '@/utils/error';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import vercel from '@/lib/vercel';
import { domainSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const addDomain = createAuthEndpoint(
  'v1/providers/:id/domains',
  {
    method: 'POST',
    body: z.object({
      domain: domainSchema,
    }),
  },
  async (ctx) => {
    const { domain } = ctx.body;

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

    const existingDomains = await db.domain.findMany({
      where: {
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });

    // get existing domains, don't allow more than plan limit
    if (existingDomains.length >= plan.features.customDomain.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_DOMAINS_LIMIT_REACHED);
    }

    try {
      const addDomainResponse = await vercel.domains.add(domain);
      const domainConfig = await vercel.domains.getConfig(domain);
      const isVerified = addDomainResponse.verified && !domainConfig.misconfigured;

      await db.domain.create({
        data: {
          domain,
          verified: isVerified,
          providerId: ctx.params.id,
        },
      });

      return {
        domain,
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

export default addDomain;
