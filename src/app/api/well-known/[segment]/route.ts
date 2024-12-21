import { NextRequest, NextResponse } from 'next/server';
import { JWK } from 'jose';

import { env } from '@/env';
import db from '@/lib/db';
import { Provider } from '@/types/app.types';
import { getSubdomain } from '@/utils/url';
import { defaultJwk } from '@/utils/jwt';

const addProtocol = (host: string): string => {
  return host.startsWith('http') ? host : `https://${host}`;
};

const getHostFromRequest = (request: NextRequest): string | null => {
  const ugHost = request.headers.get('x-ug-host');
  const defaultHost = request.headers.get('host');

  const incomingHost = ugHost || defaultHost;
  if (!incomingHost) {
    return null;
  }

  const hostWithProtocol = addProtocol(incomingHost);

  try {
    const url = new URL(hostWithProtocol);
    return url.hostname;
  } catch {
    return null;
  }
};

const getDefaultProviderId = (hostname: string) => {
  const defaultProviderDomain = env.PROVIDER_DOMAIN;
  const defaultProviderDomainSuffix = defaultProviderDomain.replace(/^(\{urlId}\.)/, '');

  if (!hostname.endsWith(defaultProviderDomainSuffix)) {
    return null;
  }

  return getSubdomain(hostname);
};

const getProvider = async (hostname: string, urlId: string | null): Promise<Provider | null> => {
  if (urlId) {
    return db.provider.findUnique({
      where: { urlId },
    });
  }

  const domain = await db.domain.findUnique({
    where: { domain: hostname },
    include: {
      Provider: true,
    },
  });

  if (!domain) {
    return null;
  }

  return domain.Provider;
};

interface Params {
  segment: string;
}

const validSegments = ['openid-configuration', 'jwks'];

const extractPublicJwk = (jwk: JWK): JWK => {
  return {
    kty: jwk.kty,
    alg: jwk.alg,
    use: 'sig',
    kid: jwk.kid,
    n: jwk.n,
    e: jwk.e,
  };
};

const jwksResponse = async (providerId: string): Promise<NextResponse> => {
  const keys = await db.jwks.findMany({
    where: {
      providerId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const dbJwks = keys.map((key) => extractPublicJwk(key.key as unknown as JWK));
  const publicJwks = [...dbJwks, extractPublicJwk(defaultJwk)];

  const response = NextResponse.json({ keys: publicJwks });
  response.headers.set('Content-Type', 'application/jwk-set+json; charset=utf-8');

  return response;
};

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  const { segment } = await params;

  if (!validSegments.includes(segment)) {
    return NextResponse.json({ error: 'Invalid route' }, { status: 404 });
  }

  const hostname = getHostFromRequest(request);
  if (!hostname) {
    return NextResponse.json({ error: 'Invalid host' }, { status: 400 });
  }

  const urlId = getDefaultProviderId(hostname);
  const provider = await getProvider(hostname, urlId);

  if (!provider) {
    return NextResponse.json({ error: 'Invalid host' }, { status: 400 });
  }

  if (segment === 'jwks') {
    return jwksResponse(provider.id);
  }

  return NextResponse.json({
    issuer: `https://${hostname}`,
    jwks_uri: `https://${hostname}/.well-known/jwks`,
    grant_types_supported: ['client_credentials'],
    subject_types_supported: ['public'],
    response_types_supported: ['code'], // alibaba validation fails without this
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: ['jti', 'iss', 'aud', 'sub', 'iat', 'nbf', 'exp'],
    scopes_supported: ['openid'],
  });
}
