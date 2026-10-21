import 'server-only';
import { CompactJWSHeaderParameters, CompactSign, JWK, JWTPayload } from 'jose';
import { nanoid } from 'nanoid';

export const ONE_HOUR = 3600;
export const MAX_EXPIRY = 2 * 24 * 60 * 60; // 2 days

export const signJwt = async (claims: JWTPayload, header: CompactJWSHeaderParameters, key: JWK): Promise<string> => {
  const payload = Buffer.from(JSON.stringify(claims));
  return new CompactSign(payload).setProtectedHeader(header).sign(key);
};

type CreateJwtOptions = {
  expiry: number;
  jwtType: boolean;
};

const createJwtOptions: CreateJwtOptions = {
  expiry: ONE_HOUR,
  jwtType: false,
};

export const createJwt = (
  claims: JWTPayload,
  key: JWK,
  opts: Partial<CreateJwtOptions> = createJwtOptions,
): Promise<string> => {
  const options = {
    ...createJwtOptions,
    ...opts,
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + options.expiry;

  const jwt = {
    ...claims,
    jti: nanoid(),
    iat: now,
    nbf: now,
    exp,
  };

  const protectedHeaders: CompactJWSHeaderParameters = {
    typ: options.jwtType ? 'jwt' : 'at+jwt',
    alg: 'RS256',
    kid: key.kid,
  };

  return signJwt(jwt, protectedHeaders, key);
};
