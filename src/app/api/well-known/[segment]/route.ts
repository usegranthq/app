import { NextRequest, NextResponse } from 'next/server';
import { JWK } from 'jose';

import { defaultJwk } from '@/utils/jwt';
import { withProtocol } from '@/utils/url';
import { getPlanByUserId } from '@/lib/billing';
import db from '@/lib/db';

const getHostFromRequest = (request: NextRequest): string | null => {
  const ugHost = request.headers.get('x-ug-host');
  const defaultHost = request.headers.get('host');

  const incomingHost = ugHost || defaultHost;
  if (!incomingHost) {
    return null;
  }

  const hostWithProtocol = withProtocol(incomingHost);

  try {
    const url = new URL(hostWithProtocol);
    return url.host;
  } catch {
    return null;
  }
};

interface ProviderDomain {
  id: string;
  issuer: string;
}

const getProviderDomain = async (hostname: string, urlId: string | null): Promise<ProviderDomain | null> => {
  if (urlId) {
    const provider = await db.provider.findUnique({
      where: { urlId },
    });

    if (!provider) {
      return null;
    }

    return {
      id: provider.id,
      issuer: new URL(urlId, withProtocol(hostname)).href,
    };
  }

  const domain = await db.domain.findUnique({
    where: { domain: hostname },
    include: {
      Provider: {
        include: {
          User: true,
        },
      },
    },
  });

  if (!domain) {
    return null;
  }

  const plan = await getPlanByUserId(domain.Provider.User.id);
  if (plan.id === 'free') {
    return null;
  }

  return {
    id: domain.Provider.id,
    issuer: domain.domain,
  };
};

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

const openIdConfigurationResponse = (issuer: string) => {
  return {
    issuer,
    jwks_uri: `${issuer}/.well-known/jwks`,
    grant_types_supported: ['client_credentials'],
    subject_types_supported: ['public'],
    response_types_supported: ['code'], // alibaba validation fails without this
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: ['jti', 'iss', 'aud', 'sub', 'iat', 'nbf', 'exp'],
    scopes_supported: ['openid'],
  };
};

interface OpenIdConfigurationParams {
  params: Promise<{
    segment: string;
  }>;
}

function extractUrlIdFromRequest(request: NextRequest): string | null {
  const parts = request.nextUrl.pathname.replace(/^\//, '').replace(/\/$/, '').split('/');

  if (parts.length === 3) {
    return parts[0];
  }

  return null; // Extract the URL ID from the path
}

export async function GET(request: NextRequest, { params }: OpenIdConfigurationParams) {
  const { segment } = await params;

  if (!validSegments.includes(segment)) {
    return NextResponse.json({ error: 'Invalid route' }, { status: 404 });
  }

  const hostname = getHostFromRequest(request);
  if (!hostname) {
    return NextResponse.json({ error: 'Invalid host' }, { status: 400 });
  }

  const urlId = extractUrlIdFromRequest(request);
  const provider = await getProviderDomain(hostname, urlId);
  if (!provider) {
    return NextResponse.json({ error: 'Invalid host' }, { status: 400 });
  }

  if (segment === 'jwks') {
    return jwksResponse(provider.id);
  }

  return NextResponse.json(openIdConfigurationResponse(provider.issuer));
}
