import { JWK } from 'jose';

import { createJwt, defaultJwk } from '@/utils/jwt';
import { getIssuer } from '@/utils/provider';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';

import { authRpcRouter } from '../rpc';

export const createAccessToken = authRpcRouter.providers.clients.tokens.create.handler(
  async ({ context, input, errors }) => {
    const { providerId, clientId, forceDefaultDomain } = input;

    const provider = await db.provider.findUnique({
      where: {
        id: providerId,
        userId: context.userId,
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
      throw errors.PROVIDER_NOT_FOUND();
    }

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        providerId,
        Provider: {
          userId: context.userId,
        },
      },
    });

    if (!client) {
      throw errors.CLIENT_NOT_FOUND();
    }

    const plan = await getPlanByUserId(context.userId);
    const customDomain = provider.Domain[0];

    const claims = {
      iss: getIssuer(provider.urlId, plan, customDomain, forceDefaultDomain),
      aud: input.audienceAsArray ? [client.audience] : client.audience,
      sub: client.subject,
    };

    const jwk = await db.jwks.findFirst({
      where: {
        providerId,
        Provider: {
          userId: context.userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const jwtOptions = {
      expiry: input.expiresIn,
      jwtType: input.useJwtType,
    };

    const signingKey: JWK = jwk ? (jwk.key as unknown as JWK) : defaultJwk;
    const expiresAt = new Date(Date.now() + input.expiresIn);

    const token = await createJwt(claims, signingKey, jwtOptions);

    return {
      accessToken: token,
      type: 'Bearer',
      expiresAt,
    };
  },
);

export default createAccessToken;
