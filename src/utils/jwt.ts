import 'server-only';

import { CompactJWSHeaderParameters, CompactSign, JWK, JWTPayload } from 'jose';
import { nanoid } from 'nanoid';

const ONE_HOUR = 3600;

export const defaultJwk = {
  kty: 'RSA',
  n: 'vbsQjhyuySunRwXBbt5CYQk0nqJwIxOgNYxeLSbVPfvQzbuJouvE21uIWKvyTxjNrHIqBX3-jJE6GLat9ExCFimV0BTF6rbryOo0nVJL0SgKkuAlXwwtcmialjNES3uVnSpJgx6yZ1PYy30VchAlQIiiiVWS3Ojf1dsVG2OJapOUdFdGkl9rzAUNL1y5gaouLzCeWkKV3VqEkPppS_-fBA5gIrijyiMnzewUkVuTfKG-8Z3sglAk9TOl1UVjxDAHQy9ymksFzDHzBIrv4SAIKKPiB-f7VLI7Uae6l6xKVzG8InELPXncIgXFULftpPo0xhdoGugRoBESEf5ctQO_rQ',
  e: 'AQAB',
  d: '_Xbqpu-qkRXAYyFNSM-j3f5uTX60UCfn36GmLquyNRwz1qSzOvO-CU4-2Dbdfs2j9ryNZsjrRt68vkdOHQ_DOdhUS6d0wBue4sn_gCxxHPphJdZMFq4uCKm12vKiSjTPqybTDlfz_hYFidOQ0tC-83eVq-KmUHjKjugfSnevHK-6FCTmdM45_s4T3fW7O94ko3H-j4hGN1Jokbe9al-SAX99_ZQGy9xwzgbHaWhTPERc59-afgWZRSa8k-N1inqZlJ4xVQaJnpYzlTetQeYXdUsQ2yx5oXFtioZpeFVZmwujrkrCCyZizSp8g4MU1N85FDT51d8CG09tRh53E63B',
  p: '-hVCPiVaCqItH1TGwmEZYN0cyViV12CtpiKRvDRMsOVR2Otx91nvG3KGmgqqYsslPhY4BhQQeJMo1FWPGjQ24juj2FpHYNhlNh1iHELpWYLKMG_zojnvm2oC6q7zyKGLLcK10FJzzawJs8iS-b2OhaZ7JXpmoua526FoEpLTjyU',
  q: 'wjhBNmLC_0EGSKwl_DjRpIVJQMqjIvq7X0LmMvsrdJK1ayeBC_iFdiamKhrDWiFS4slBls_Wz1h_ldGVUvjQnj-FyLJgj4Ktbu2VK5cLwRgWrnzT6bgDtCCRYqBNmbVaxTjb1lzez569uXGwe-F3nrFA5cbLp6EmKIdiFlZ6a-k',
  dp: '6dTC0ZTfMh4djrQX_FwJ_LYCWolH4dB1zWd5WL6WDrj85JSRRTSEC-fzz0i1tBY6RmlEDPrpw7Plc1Rkr52uy630LzGKmBT93bFvsPkncxiFsPCcn00Iqwpem8zmCOxzVGBA2_6cZOy9Tar3Mih5gKH_dzWRjjOqCKBMzUEYKzk',
  dq: 'JG-3VEOs_4QscJ_TNIFYWzwiJQSfHGXblyCO3UufuGv5mxO7Mwq5xxOzIr0InzUXPrKxGmD9lMKulOXP1NQXF0kliSRl1yaV8PSjgp0AuIYTY0LJ4tQB5d4iSFV4mXibgdqL66haqKrIPy0kBemjrmLkoPbtqBIkfYAAl947c1k',
  qi: 'xRG42AS-3HVRjqKuVTRt2Hlgvzsn435ilEpbhbgqOyKLEQ6W82xyR0B7oba-QDkyxEh0nLvxO95EHWB0HolK4LxL-i18GJqXazQAaX9ZGKPh80c5VGL0cYitFVLNXGqSP6pVGeQD_07H0daclWM31W_6aVPU0iWCHCUiS2BQnuQ',
  kid: 'def-rsG97agLkQ9055xqfpfxT',
  alg: 'RS256',
};

export const signJwt = async (claims: JWTPayload, header: CompactJWSHeaderParameters, key: JWK): Promise<string> => {
  const payload = Buffer.from(JSON.stringify(claims));
  return new CompactSign(payload).setProtectedHeader(header).sign(key);
};

export const createJwt = (
  claims: JWTPayload,
  key: JWK,
  expiry: number = ONE_HOUR,
  jwtType = false,
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiry;

  const jwt = {
    ...claims,
    jti: nanoid(),
    iat: now,
    nbf: now,
    exp,
  };

  const protectedHeaders: CompactJWSHeaderParameters = {
    typ: jwtType ? 'jwt' : 'at+jwt',
    alg: 'RS256',
    kid: key.kid,
  };

  return signJwt(jwt, protectedHeaders, key);
};
