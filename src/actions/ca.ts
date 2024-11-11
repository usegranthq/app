'use server';

import https from 'node:https';
import { TLSSocket } from 'node:tls';

import { verifySession } from '@/data/_verifySession';

interface CaDetails {
  name: string;
  thumbprint: string;
}

async function retriveDomainDetils(hostname: string): Promise<CaDetails> {
  const options = {
    hostname,
    port: 443,
    method: 'GET',
    agent: false, // Ensures a fresh connection to get certificate info
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const socket = res.socket as TLSSocket;
      const cert = socket.getPeerCertificate(true);

      if (!cert || !cert.issuer) {
        reject();
      }

      resolve({
        name: cert.issuer.O,
        thumbprint: cert.issuerCertificate.issuerCertificate.fingerprint,
      });

      res.destroy();
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });

    req.end();
  });
}

export const getCaDetails = async (domain: string): ActionResponse<CaDetails> => {
  await verifySession();

  try {
    const ca = await retriveDomainDetils(domain);

    if (!ca) {
      throw 'Failed to retrieve CA details';
    }

    return [null, ca];
  } catch {
    return ['Failed to retrieve CA details', null];
  }
};
