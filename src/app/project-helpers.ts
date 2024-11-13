import { Project, Domain } from '@/types/app.types';
import { env } from '@/env';

const withProtocol = (domain: string) => (domain.startsWith('http') ? domain : `https://${domain}`);

export function getProjectDomain(project: Project, domains: Domain[]) {
  const domain = domains[0]?.domain ?? env.PROJECT_DOMAIN.replace('{urlId}', project.urlId);
  return domain;
}

export function getWellKnownOpenIdUrl(domain: string) {
  return `${withProtocol(domain)}/.well-known/openid-configuration`;
}

export function getWellKnownJwksUrl(domain: string) {
  return `${withProtocol(domain)}/.well-known/jwks`;
}

export function getDefaultDomain(urlId: string, path: string = '/') {
  const domain = withProtocol(env.PROJECT_DOMAIN.replace('{urlId}', urlId));
  return new URL(path, domain).toString();
}
