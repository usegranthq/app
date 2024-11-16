import { exportJWK, generateKeyPair, JWK } from 'jose';
import { nanoid } from 'nanoid';

type Alg = 'RS256';

export const generateJwk = async (alg: Alg): Promise<[string, JWK]> => {
  const kid = nanoid();
  const { privateKey } = await generateKeyPair(alg);

  const jwk = await exportJWK(privateKey);
  jwk.kid = kid;
  jwk.alg = alg;

  return [kid, jwk];
};
