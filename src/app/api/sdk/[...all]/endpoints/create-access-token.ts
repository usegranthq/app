import { z } from 'zod';
import { APIError, createEndpoint } from 'better-call';
import { JWK } from 'jose';

import db from '@/lib/db';
import { getPlanByUserId } from '@/lib/auth';
import { createJwt, defaultJwk } from '@/utils/jwt';
import { getIssuer } from '@/utils/project';

const ONE_HOUR = 60 * 60;
const MAX_EXPIRY = 2 * 24 * 60 * 60; // 2 days

const createToken = createEndpoint(
  '/:projects/:projectId/clients/:clientId/tokens',
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
    const { projectId, clientId } = ctx.params;
    const { forceDefaultDomain } = ctx.body;

    const project = await db.project.findUnique({
      where: {
        id: projectId,
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

    if (!project) {
      throw new APIError('NOT_FOUND', {
        message: 'Project not found',
      });
    }

    const client = await db.client.findUnique({
      where: {
        id: clientId,
        projectId,
      },
    });

    if (!client) {
      throw new APIError('NOT_FOUND', {
        message: 'Client not found',
      });
    }

    const plan = await getPlanByUserId(project.User.id);
    const customDomain = project.Domain[0];

    const claims = {
      iss: getIssuer(project.urlId, plan, customDomain, forceDefaultDomain),
      aud: ctx.body.audienceAsArray ? [client.audience] : client.audience,
      sub: client.subject,
    };

    const jwk = await db.jwks.findFirst({
      where: {
        projectId,
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
    const token = await createJwt(claims, signingKey, jwtOptions);

    const expiresAt = new Date(Date.now() + ctx.body.expiresIn);

    return {
      accessToken: token,
      type: 'Bearer',
      expiresAt,
    };
  },
);

export default createToken;
