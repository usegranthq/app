// for hosted environments under a reverse proxy
// e.g. cloudflare tunnerl, etc
export const getSiteUrlFromRequest = (request: Request): string => {
  const protocol = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('x-forwarded-host');

  if (!protocol || !host) {
    return request.url;
  }

  return `${protocol}://${host}`;
};
