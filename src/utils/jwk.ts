import { exportJWK, generateKeyPair, JWK } from 'jose';
import { nanoid } from 'nanoid';

type Alg = 'RS256';

const generateKid = (): string => {
  const id = nanoid();
  return 'gen-' + id;
};

export const generateJwk = async (alg: Alg): Promise<[string, JWK]> => {
  const kid = generateKid();
  const { privateKey } = await generateKeyPair(alg, { extractable: true });

  const jwk = await exportJWK(privateKey);
  jwk.kid = kid;
  jwk.alg = alg;

  return [kid, jwk];
};
