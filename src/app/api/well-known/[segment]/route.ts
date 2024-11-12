import { NextRequest, NextResponse } from 'next/server';

import db from '@/lib/db';
import { Project } from '@/types/app.types';
import { getSubdomain } from '@/utils/url';
import { defaultJwk } from '@/utils/jwt';
import { JWK } from 'jose';

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

const getDefaultProjectId = (hostname: string) => {
  const defaultProjectDomain = process.env.PROJECT_DOMAIN as string;
  const defaultProjectDomainSuffix = defaultProjectDomain.replace(/^(\{urlId}\.)/, '');

  if (!hostname.endsWith(defaultProjectDomainSuffix)) {
    return null;
  }

  return getSubdomain(hostname);
};

const getProject = async (hostname: string, urlId: string | null): Promise<Project | null> => {
  if (urlId) {
    return db.project.findUnique({
      where: { urlId },
    });
  }

  const domain = await db.domain.findUnique({
    where: { domain: hostname },
    include: {
      Project: true,
    },
  });

  if (!domain) {
    return null;
  }

  return domain.Project;
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

const jwksResponse = (): NextResponse => {
  const keys = [extractPublicJwk(defaultJwk)];
  const response = NextResponse.json({ keys });

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

  const urlId = getDefaultProjectId(hostname);
  const project = await getProject(hostname, urlId);

  if (!project) {
    return NextResponse.json({ error: 'Invalid host' }, { status: 400 });
  }

  if (segment === 'jwks') {
    return jwksResponse();
  }

  return NextResponse.json({
    issuer: `https://${hostname}`,
    jwks_uri: `https://${hostname}/.well-known/jwks`,
    subject_types_supported: ['public'],
    response_types_supported: [],
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: ['sub', 'aud', 'exp', 'iat', 'iss', 'jti', 'nbf'],
    scopes_supported: ['openid'],
  });
}
