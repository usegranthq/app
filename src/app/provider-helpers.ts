import env from '@/env';
import { Domain, Provider } from '@/types/app.types';
import { withProtocol } from '@/utils/url';

export function getProviderDomain(provider: Provider, domains: Domain[]) {
  if (domains.length === 0) {
    const providerDomain = new URL(provider.urlId, withProtocol(env.PROVIDER_DOMAIN));
    return providerDomain.href;
  }

  return domains[0].domain;
}

export function getWellKnownOpenIdConfigUrl(domain: string) {
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
