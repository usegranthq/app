import { z } from 'zod';
import * as jose from 'jose';
import ky from 'ky';

import db from '@/lib/db';

import { createAuthEndpoint } from './utils/call';
import ERRORS, { SdkError } from './utils/errors';

const tokenSchema = z.object({
  token: z.string(),
});

const createOpenIdConfigSchema = (issuer: string) => {
  return z.object({
    issuer: z.literal(issuer),
    jwks_uri: z.string().url(),
    subject_types_supported: z.array(z.string()).refine((value) => value.includes('public')),
    claims_supported: z.array(z.string()),
    id_token_signing_alg_values_supported: z.array(z.string()).refine((value) => value.includes('RS256')),
  });
};

const allowedHeaderTypes = ['jwt', 'at+jwt'];

const toHours = (seconds: number = 0) => Math.floor(seconds / 3600);

const validateToken = createAuthEndpoint(
  'v1/tenants/:tenantId/validate',
  {
    method: 'POST',
    body: tokenSchema,
  },
  async (ctx) => {
    const { tenantId } = ctx.params;
    const { token } = ctx.body;

    const tenantExists = await db.tenant
      .count({
        where: {
          id: tenantId,
        },
      })
      .then(Boolean);

    if (!tenantExists) {
      throw new SdkError('NOT_FOUND', ERRORS.TENANT_NOT_FOUND);
    }

    let claims: jose.JWTPayload;
    try {
      // check if token is valid jwt
      claims = jose.decodeJwt(token);
    } catch {
      throw new SdkError('BAD_REQUEST', ERRORS.INVALID_TOKEN);
    }

    // decode protected header
    let headerType: string | undefined;
    try {
      const protectedHeader = jose.decodeProtectedHeader(token);
      if (!protectedHeader.typ || !allowedHeaderTypes.includes(protectedHeader.typ)) {
        throw new Error('Invalid header type');
      }
      headerType = protectedHeader.typ;
    } catch {
      throw new SdkError('BAD_REQUEST', ERRORS.INVALID_TOKEN_HEADERS);
    }

    const tenantProvider = await db.tenantProvider.findFirst({
      where: {
        tenantId,
        url: claims.iss,
      },
    });

    if (!tenantProvider) {
      throw new SdkError('NOT_FOUND', ERRORS.INVALID_ISSUER);
    }

    // check if token expiry remaining is less than tenant.earliestIssuanceTimeAllowed
    const currentTimeInSecs = Math.floor(Date.now() / 1000);
    const expiryTimeInSecs = claims.exp ?? 0;
    const issuerTimeInSecs = claims.iat ?? 0;

    if (expiryTimeInSecs <= currentTimeInSecs) {
      throw new SdkError('BAD_REQUEST', ERRORS.EXPIRED_TOKEN);
    }

    // check if token is issued before tenant.earliestIssuanceTimeAllowed
    const issuerTimeInHours = toHours(currentTimeInSecs - issuerTimeInSecs);
    if (issuerTimeInHours > tenantProvider.earliestIssuanceTimeAllowed) {
      throw new SdkError('BAD_REQUEST', ERRORS.EXPIRED_TOKEN);
    }

    // get jwks endpoint from /.well-known/openid-configuration
    let jwksEndpoint: string = '';
    const openIdConfigSchema = createOpenIdConfigSchema(tenantProvider.url);
    type OpenIdConfig = z.infer<typeof openIdConfigSchema>;

    try {
      const oidUrl = new URL('/.well-known/openid-configuration', tenantProvider.url);
      const data = await ky.get(oidUrl.toString()).json<OpenIdConfig>();

      const validationResult = openIdConfigSchema.parse(data);
      jwksEndpoint = validationResult.jwks_uri;
    } catch {
      throw new SdkError('BAD_REQUEST', ERRORS.INVALID_ISSUER);
    }

    // validate remote jwt signatue from remote jwks endpoint
    try {
      const JWKS = jose.createRemoteJWKSet(new URL(jwksEndpoint));
      await jose.jwtVerify(token, JWKS, {
        issuer: tenantProvider.url,
        audience: tenantProvider.audience,
        requiredClaims: ['sub', 'exp', 'iat', 'iss', 'aud'],
        typ: headerType,
        subject: claims.sub,
        maxTokenAge: claims.exp,
      });
    } catch {
      throw new SdkError('BAD_REQUEST', ERRORS.INVALID_TOKEN);
    }

    return {
      exp: claims.exp,
    };
  },
);

export default validateToken;
