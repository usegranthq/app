'use server';

import { spawn } from 'node:child_process';
import { X509Certificate } from 'node:crypto';
import { verifySession } from '@/data/_verifySession';

interface CaDetails {
  name: string;
  thumbprint: string;
}

async function getCertificates(hostname: string): Promise<string> {
  let data = '';

  const controller = new AbortController();

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn('openssl', [
        's_client',
        '-servername',
        hostname,
        '-showcerts',
        '-connect',
        `${hostname}:443`,
      ]);

      child.stdout.on('data', (chunk) => {
        data += chunk.toString();
      });

      child.stdout.on('end', () => {
        resolve();
      });

      child.on('error', (error) => {
        reject(new Error(`Child process error: ${error.message}`));
      });

      // Handle process exit to clean up resources
      child.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Child process exited with code ${code}`));
        }
      });

      setTimeout(() => {
        controller.abort();
        child.kill();
      }, 5_000);
    });
  } catch (error) {
    console.log(error);

    if (data.length > 0) {
      return data;
    }

    throw error;
  }

  return data;
}

const certificateRegex = /-----BEGIN CERTIFICATE-----(?:[\s\S]*?)-----END CERTIFICATE-----/g;
function getTopIntermediateCertificate(certificates: string): string | null {
  const intermediateCertificate = certificates.match(certificateRegex);

  if (!intermediateCertificate || intermediateCertificate.length === 0) {
    return null;
  }

  return intermediateCertificate.at(-1) ?? null;
}

async function retrieveDomainDetails(hostname: string): Promise<CaDetails> {
  const certificates = await getCertificates(hostname);
  const topIntermediateCertificate = getTopIntermediateCertificate(certificates);

  if (!topIntermediateCertificate) {
    throw null;
  }

  const x509 = new X509Certificate(topIntermediateCertificate);
  const issuer = x509.issuer.split('\n').join(', ');

  return {
    name: issuer,
    thumbprint: x509.fingerprint,
  };
}

export const getCaDetails = async (domain: string): ActionResponse<CaDetails> => {
  await verifySession();

  try {
    const ca = await retrieveDomainDetails(domain);

    if (!ca) {
      throw 'Failed to retrieve CA details';
    }

    return [null, ca];
  } catch {
    return ['Failed to retrieve CA details', null];
  }
};
