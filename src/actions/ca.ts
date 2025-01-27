'use server';

import { Certificate } from 'node:tls';

import { verifySession } from '@/data/_verifySession';
import { getIssuerCertifcate } from '@/utils/ca';

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
    const certificate = await getIssuerCertifcate(domain);
    const ca = {
      issuer: formatIssuer(certificate.issuer),
      thumbprint: certificate.fingerprint,
    };

    return [null, ca];
  } catch {
    return ['Failed to retrieve CA details', null];
  }
};
