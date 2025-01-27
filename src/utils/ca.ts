import { DetailedPeerCertificate, TLSSocket } from 'node:tls';
import https from 'node:https';

export const getCertificate = (hostname: string): Promise<DetailedPeerCertificate> => {
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

        if (!cert || !cert.issuerCertificate) {
          reject('invalid certificate');
        }

        resolve(cert);
      },
    );

    req.on('error', reject);
    req.end();
  });
};

export const getCertificateDepth = (cert: DetailedPeerCertificate): number => {
  const seen = new Map();

  const getDepth = (cert: DetailedPeerCertificate): number => {
    if (seen.has(cert.fingerprint)) {
      // last cert in seen is the root certificate
      // get index of cert.fingerprint
      return seen.size - 1;
    }

    seen.set(cert.fingerprint, cert);
    return getDepth(cert.issuerCertificate);
  };

  return getDepth(cert);
};

const getCertByDepth = (cert: DetailedPeerCertificate, depth: number): DetailedPeerCertificate => {
  let currentDepth = 0;
  let currentCert = cert;

  while (currentDepth < depth) {
    currentCert = currentCert.issuerCertificate;
    currentDepth++;
  }

  return currentCert;
};

export const getRootCert = (cert: DetailedPeerCertificate): DetailedPeerCertificate => {
  const depth = getCertificateDepth(cert);
  return getCertByDepth(cert, depth);
};

// get the top intermediate issuer of the certificate on the chain
// if the depth is 1, then the issuer is the root certificate, return the root cert
// if the depth is greater than 1, then the issuer is the intermediate certificate
// which is the issuer of the previous certificate, i.e top intermediate certificate
export const selectIssuerCert = (cert: DetailedPeerCertificate, depth: number): DetailedPeerCertificate => {
  if (depth === 1) {
    // cert at depth 0 is the leaf cert
    // cert.issuerCertificate is depth 1 and is the root cert
    return cert.issuerCertificate;
  }

  // to select top intermediate cert, use getCertByDepth(cert, depth - 1)
  return getCertByDepth(cert, depth);
};

export const getIssuerCertifcate = async (domain: string): Promise<DetailedPeerCertificate> => {
  const certificate = await getCertificate(domain);
  const depth = getCertificateDepth(certificate.issuerCertificate);

  // a certificate is valid if it has a depth of 1,
  // i.e. it is signed by the root certificate.
  // if the depth is less than 1, then the certificate is not valid
  if (depth < 1) {
    throw new Error('Invalid certificate');
  }

  const cert = selectIssuerCert(certificate, depth);

  return cert;
};
