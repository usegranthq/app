import { Domain, Provider } from '@/types/app.types';

import { withProtocol } from '@/utils/url';
import env from '@/env';

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

export function getWellKnownURL(urlId: string, path: string = '/') {
  const providerDomain = new URL(urlId, withProtocol(env.PROVIDER_DOMAIN));
  return (providerDomain.href + path).toString().replace(/\/$/, '');
}

export function getWellKnownHostname(urlId: string) {
  const domain = getWellKnownURL(urlId);
  return new URL(domain).hostname;
}
