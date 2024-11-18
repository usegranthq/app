import db from '@/lib/db';
import { createJwt, defaultJwk } from '@/utils/jwt';
import { getIssuer } from '@/utils/project';
import { APIError, createEndpoint } from 'better-call';
import { JWK } from 'jose';

const ONE_HOUR = 60 * 60;

const createToken = createEndpoint(
  '/:projects/:projectId/clients/:clientId/tokens',
  {
    method: 'POST',
  },
  async (ctx) => {
    const { projectId, clientId } = ctx.params;

    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return new APIError('NOT_FOUND', {
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
      return new APIError('NOT_FOUND', {
        message: 'Client not found',
      });
    }

    const claims = {
      iss: getIssuer(project.urlId),
      aud: client.audience,
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

    const signingKey: JWK = jwk ? (jwk.key as unknown as JWK) : defaultJwk;
    const token = await createJwt(claims, signingKey, ONE_HOUR);

    return {
      token,
      type: 'Bearer',
      expiresIn: ONE_HOUR,
    };
  },
);

export default createToken;
