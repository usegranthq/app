import { Project, Domain } from '@/types/app.types';
import { env } from '@/env';

export function getProjectDomain(project: Project, domains: Domain[]) {
  const domain = domains[0]?.domain ?? env.PROJECT_DOMAIN.replace('{urlId}', project.urlId);
  return domain;
}

export function getWellKnownUrl(domain: string) {
  const protocol = domain.startsWith('http') ? '' : 'https://';
  return `${protocol}${domain}/.well-known/openid-configuration`;
}

export function getDefaultDomain(urlId: string, path?: string) {
  const domain = env.PROJECT_DOMAIN.replace('{urlId}', urlId);
  return path ? new URL(path, domain).toString() : domain;
}
