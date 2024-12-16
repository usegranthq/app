'use server';

import https from 'node:https';
import { DetailedPeerCertificate, TLSSocket } from 'node:tls';

import { verifySession } from '@/data/_verifySession';

interface CaDetails {
  name: string;
  thumbprint: string;
}

const getRootCertificate = (cert: DetailedPeerCertificate, seen = new Map()): DetailedPeerCertificate => {
  if (seen.has(cert.fingerprint)) {
    // last cert in seen is the root certificate
    // get index of cert.fingerprint
    const keys = Array.from(seen.keys());
    const index = keys.indexOf(cert.fingerprint);
    return seen.get(keys[index - 1]);
  }

  seen.set(cert.fingerprint, cert);
  return getRootCertificate(cert.issuerCertificate, seen);
};

async function getTopCa(hostname: string): Promise<DetailedPeerCertificate> {
  return new Promise((resolve, reject) => {
    // Make an HTTPS request to get the server's certificate
    const req = https.request(
      {
        hostname,
        port: 443,
        method: 'GET',
        agent: false,
        rejectUnauthorized: false, // Don't reject self-signed certificates
      },
      (res) => {
        // Get the peer certificate once the connection is established
        const socket = res.socket as TLSSocket;
        const cert = socket.getPeerCertificate(true);

        if (!cert) {
          reject(new Error('No certificate found'));
        }

        const rootCertificate = getRootCertificate(cert);

        if (rootCertificate) {
          resolve(rootCertificate);
        } else {
          reject(new Error('No root certificate found'));
        }
      },
    );

    req.on('error', reject);
    req.end();
  });
}

async function retrieveDomainDetails(hostname: string): Promise<CaDetails> {
  const certificate = await getTopCa(hostname);

  const issuer = Object.entries(certificate.issuer)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return {
    name: issuer,
    thumbprint: certificate.fingerprint,
  };
}

export const getCaDetails = async (domain: string): ActionResponse<CaDetails> => {
  await verifySession();

  try {
    const ca = await retrieveDomainDetails(domain);

    if (!ca) {
      throw new Error('Failed to retrieve CA details');
    }

    return [null, ca];
  } catch {
    return ['Failed to retrieve CA details', null];
  }
};
