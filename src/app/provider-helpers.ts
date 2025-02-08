import { env } from '@/env';
import { Domain, Provider } from '@/types/app.types';

const withProtocol = (domain: string) => (domain.startsWith('http') ? domain : `https://${domain}`);

export function getProviderDomain(provider: Provider, domains: Domain[]) {
  const domain = domains[0]?.domain ?? env.PROVIDER_DOMAIN.replace('{urlId}', provider.urlId);
  return domain;
}

export function getWellKnownOpenIdUrl(domain: string) {
  return `${withProtocol(domain)}/.well-known/openid-configuration`;
}

export function getWellKnownJwksUrl(domain: string) {
  return `${withProtocol(domain)}/.well-known/jwks`;
}

export function getDefaultDomain(urlId: string, path: string = '/') {
  const domain = withProtocol(env.PROVIDER_DOMAIN.replace('{urlId}', urlId));
  return new URL(path, domain).toString().replace(/\/$/, '');
}

export function getDefaultDomainHostname(urlId: string) {
  const domain = getDefaultDomain(urlId);
  return new URL(domain).hostname;
}
