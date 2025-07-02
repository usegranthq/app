import { z } from 'zod/v4';

import { getApiErrorMessage } from '@/utils/error';
import { STATUS_CODES } from '@/utils/rest';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';
import customDomain from '@/lib/domain';
import { domainSchema } from '@/schema';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';
import { toSdkJsonResponse } from './utils/response';
import { domainFields } from './utils/return-fields';

const addDomain = createAuthEndpoint(
  'v1/providers/:id/domains',
  {
    method: 'POST',
    body: z.object({
      domain: domainSchema,
    }),
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

    const existingDomains = await db.domain.findMany({
      where: {
        providerId: ctx.params.id,
        Provider: {
          userId: ctx.context.userId,
        },
      },
    });

    // check if domain is already added
    const isDomainAlreadyAdded = existingDomains.some((domain) => domain.domain === ctx.body.domain);
    if (isDomainAlreadyAdded) {
      throw new SdkError('CONFLICT', ERRORS.DOMAIN_ALREADY_ADDED);
    }

    // get existing domains, don't allow more than plan limit
    if (existingDomains.length >= plan.features.customDomain.limit) {
      throw new SdkError('FORBIDDEN', ERRORS.MAX_DOMAINS_LIMIT_REACHED);
    }

    try {
      const [isVerified] = await customDomain.add(ctx.body.domain);
      const domain = await db.domain.create({
        data: {
          domain: ctx.body.domain,
          verified: isVerified,
          providerId: ctx.params.id,
        },
        select: domainFields,
      });

      return toSdkJsonResponse(domain, STATUS_CODES.CREATED);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Something went wrong');

      return new SdkError('INTERNAL_SERVER_ERROR', {
        message: errorMessage,
      });
    }
  },
);

export default addDomain;
