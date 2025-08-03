import * as jose from 'jose';
import ky from 'ky';
import { z } from 'zod/v4';

import db from '@/lib/db';
import { conditionsSchema } from '@/schema';

import { authRpcRouter } from '../rpc';
import { validateClaimWithCondition } from './utils/token';

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

const OPENID_URL = '/.well-known/openid-configuration';

const validateToken = authRpcRouter.tenants.tokens.validate.handler(async ({ context, input, errors }) => {
  const { tenantId, token, tenantProviderPolicyId } = input;

  const tenantExists = await db.tenant
    .count({
      where: {
        id: tenantId,
        userId: context.userId,
      },
    })
    .then(Boolean);

  if (!tenantExists) {
    throw errors.TENANT_NOT_FOUND();
  }

  let claims: jose.JWTPayload;
  try {
    // check if token is valid jwt
    claims = jose.decodeJwt(token);
  } catch {
    throw errors.INVALID_TOKEN();
  }

  const tenantProvider = await db.tenantProvider.findFirst({
    where: {
      tenantId,
      url: claims.iss,
      Tenant: {
        userId: context.userId,
      },
    },
  });

  if (!tenantProvider) {
    throw errors.INVALID_ISSUER();
  }

  const tenantProviderPolicy = await db.tenantProviderPolicy.findFirst({
    where: {
      id: tenantProviderPolicyId,
      tenantProviderId: tenantProvider.id,
    },
  });

  if (!tenantProviderPolicy) {
    throw errors.INVALID_ISSUER();
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
    throw errors.INVALID_TOKEN_HEADERS();
  }

  // check if token expiry remaining is less than tenant.earliestIssuanceTimeAllowed
  const currentTimeInSecs = Math.floor(Date.now() / 1000);
  const expiryTimeInSecs = claims.exp ?? 0;
  const issuerTimeInSecs = claims.iat ?? 0;

  if (expiryTimeInSecs <= currentTimeInSecs) {
    throw errors.EXPIRED_TOKEN();
  }

  // check if token is issued before tenant.earliestIssuanceTimeAllowed
  const issuerTimeInHours = toHours(currentTimeInSecs - issuerTimeInSecs);
  if (issuerTimeInHours > tenantProvider.earliestIssuanceTimeAllowed) {
    throw errors.EXPIRED_TOKEN();
  }

  // validate if audience is configured and matches the token audience
  const audience = tenantProviderPolicy.audience ?? tenantProvider.audience;
  if (claims.aud !== audience) {
    throw errors.INVALID_TOKEN();
  }

  // validate if conditions are configured and matches the token conditions
  if (tenantProviderPolicy.conditions) {
    const conditionsValidation = z.array(conditionsSchema).safeParse(tenantProviderPolicy.conditions);
    if (!conditionsValidation.success) {
      throw errors.INVALID_TOKEN();
    }

    const conditions = conditionsValidation.data;
    for (const condition of conditions) {
      if (!validateClaimWithCondition(condition, claims)) {
        throw errors.INVALID_TOKEN();
      }
    }
  }

  // get jwks endpoint from /.well-known/openid-configuration
  let jwksEndpoint: string = '';
  const openIdConfigSchema = createOpenIdConfigSchema(tenantProvider.url);
  type OpenIdConfig = z.infer<typeof openIdConfigSchema>;

  try {
    const oidUrl = new URL(OPENID_URL, tenantProvider.url);
    const data = await ky.get(oidUrl.toString()).json<OpenIdConfig>();

    const validationResult = openIdConfigSchema.parse(data);
    jwksEndpoint = validationResult.jwks_uri;
  } catch {
    throw errors.INVALID_ISSUER();
  }

  // validate remote jwt signatue from remote jwks endpoint
  try {
    const JWKS = jose.createRemoteJWKSet(new URL(jwksEndpoint));
    await jose.jwtVerify(token, JWKS, {
      issuer: tenantProvider.url,
      audience,
      requiredClaims: ['sub', 'exp', 'iat', 'iss', 'aud'],
      typ: headerType,
      subject: claims.sub,
      maxTokenAge: claims.exp,
    });
  } catch {
    throw errors.INVALID_TOKEN();
  }

  return {
    exp: claims.exp,
  };
});

export default validateToken;
