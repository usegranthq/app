import { describe, expect, it } from 'vitest';

import { Condition, validateClaimWithCondition } from './token';

const mockClaims = {
  sub: 'ri0m0mthf03pfr8oo4w6no5z',
  exp: 1716441600,
  iat: 1716441600,
  iss: 'https://mockauth.usegrant.dev',
  aud: 'usegrant',
};

type Mock = Condition & { expect: boolean };

const mocks: Mock[] = [
  // String comparison tests
  {
    key: 'sub',
    operator: 'stringEquals',
    value: 'ri0m0mthf03pfr8oo4w6no5z',
    expect: true,
  },
  {
    key: 'sub',
    operator: 'stringEquals',
    value: 'different-value',
    expect: false,
  },
  {
    key: 'sub',
    operator: 'stringNotEquals',
    value: 'ri0m0mthf03pfr8oo4w6no5z',
    expect: false,
  },
  {
    key: 'sub',
    operator: 'stringNotEquals',
    value: 'different-value',
    expect: true,
  },

  // Wildcard pattern matching tests
  {
    key: 'sub',
    operator: 'stringLike',
    value: 'ri0m0mthf03pfr8oo4w6no5z',
    expect: true,
  },
  {
    key: 'sub',
    operator: 'stringLike',
    value: 'ri0m0mthf03pfr8oo4w6**',
    expect: true,
  },
  {
    key: 'sub',
    operator: 'stringLike',
    value: '**4w6no5z',
    expect: true,
  },
  {
    key: 'sub',
    operator: 'stringNotLike',
    value: 'ri0m0mthf03pfr8oo4w6**',
    expect: false,
  },
  {
    key: 'sub',
    operator: 'stringNotLike',
    value: 'ri0m0mthf03pfr8oo4w6**567',
    expect: true,
  },
];

describe('SDK: Token', () => {
  it.each(mocks)(`should return $expect when the claim key $key ${mockClaims.sub} is $operator=$value`, (mock) => {
    expect(validateClaimWithCondition(mock, mockClaims)).toBe(mock.expect);
  });

  it('return false when the claim key is does not exist in the token', () => {
    expect(validateClaimWithCondition({ key: 'nonexistent', operator: 'stringEquals', value: 'any' }, mockClaims)).toBe(
      false,
    );
  });
});
