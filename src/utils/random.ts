import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

export const generateLoginToken = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 3,
    separator: '-',
    style: 'lowerCase',
  });
};
