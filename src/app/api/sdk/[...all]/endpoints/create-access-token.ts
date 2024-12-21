import { z } from 'zod';
import { JWK } from 'jose';

import db from '@/lib/db';
import { getPlanByUserId } from '@/lib/auth';
import { createJwt, defaultJwk, MAX_EXPIRY, ONE_HOUR } from '@/utils/jwt';
import { getIssuer } from '@/utils/provider';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const createToken = createAuthEndpoint(
  '/:providers/:providerId/clients/:clientId/tokens',
  {
    method: 'POST',
    body: z.object({
      expiresIn: z.number().positive().max(MAX_EXPIRY).default(ONE_HOUR),
      useJwtType: z.boolean().optional(),
      audienceAsArray: z.boolean().optional(),
      forceDefaultDomain: z.boolean().optional(),
    }),
  },
  async (ctx) => {
    const { providerId, clientId } = ctx.params;
    const { forceDefaultDomain } = ctx.body;

    const provider = await db.provider.findUnique({
      where: {
        id: providerId,
      },
      include: {
        Domain: {
          where: {
            verified: true,
          },
        },
        User: true,
      },
    });

    if (!provider) {
      throw new SdkError('NOT_FOUND', ERRORS.PROVIDER_NOT_FOUND);
    }

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        providerId,
      },
    });

    if (!client) {
      throw new SdkError('NOT_FOUND', ERRORS.CLIENT_NOT_FOUND);
    }

    const plan = await getPlanByUserId(provider.User.id);
    const customDomain = provider.Domain[0];

    const claims = {
      iss: getIssuer(provider.urlId, plan, customDomain, forceDefaultDomain),
      aud: ctx.body.audienceAsArray ? [client.audience] : client.audience,
      sub: client.subject,
    };

    const jwk = await db.jwks.findFirst({
      where: {
        providerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const jwtOptions = {
      expiry: ctx.body.expiresIn,
      jwtType: ctx.body.useJwtType,
    };

    const signingKey: JWK = jwk ? (jwk.key as unknown as JWK) : defaultJwk;
    const expiresAt = new Date(Date.now() + ctx.body.expiresIn);

    const token = await createJwt(claims, signingKey, jwtOptions);

    return {
      accessToken: token,
      type: 'Bearer',
      expiresAt,
    };
  },
);

export default createToken;
