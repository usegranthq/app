import slugify from 'slugify';
import Sqids from 'sqids';

const sqids = new Sqids({
  alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
});

export const createUrlId = (name: string) => {
  const urlSuffix = sqids.encode([Date.now()]);
  return slugify(name, { lower: true }) + '-' + urlSuffix;
};

export const getIssuer = (urlId: string) => {
  return `https://${urlId}.auth.usegrant.dev`;
};
