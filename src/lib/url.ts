export const getSubdomain = (url: string): string => {
  let domain = url;
  if (url.includes('://')) {
    domain = url.split('://')[1];
  }
  const subdomain = domain.split('.')[0];
  return subdomain;
};
