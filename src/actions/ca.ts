'use server';

import { Certificate } from 'node:tls';

import { verifySession } from '@/data/_verifySession';
import { getCertificate, getCertificateDepth, selectIssuerCert } from '@/utils/ca';

interface CaDetails {
  issuer: string;
  thumbprint: string;
}

const formatIssuer = (issuer: Certificate) => {
  return Object.entries(issuer)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

export const getCaDetails = async (domain: string): ActionResponse<CaDetails> => {
  await verifySession();

  try {
    const certificate = await getCertificate(domain);
    const depth = getCertificateDepth(certificate.issuerCertificate);

    // a certificate is valid if it has a depth of 1,
    // i.e. it is signed by the root certificate.
    // if the depth is less than 1, then the certificate is not valid
    if (depth < 1) {
      return ['Invalid certificate', null];
    }

    const cert = selectIssuerCert(certificate, depth);

    const ca = {
      issuer: formatIssuer(cert.issuer),
      thumbprint: cert.fingerprint,
    };

    if (!ca) {
      throw new Error('Failed to retrieve CA details');
    }

    return [null, ca];
  } catch {
    return ['Failed to retrieve CA details', null];
  }
};
