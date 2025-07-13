import * as jose from 'jose';
import wildcard from 'wildcard-match';
import { z } from 'zod/v4';

import { conditionsSchema } from '@/schema';

export type Condition = z.infer<typeof conditionsSchema>;

const isMatch = (value: string, pattern: string) => {
  return wildcard(pattern, { separator: false })(value);
};

export const validateClaimWithCondition = (condition: Condition, claims: jose.JWTPayload) => {
  const claim = claims[condition.key];

  if (!claim || typeof claim !== 'string') {
    return false;
  }

  switch (condition.operator) {
    case 'stringEquals': {
      return claim === condition.value;
    }
    case 'stringNotEquals': {
      return claim !== condition.value;
    }
    case 'stringLike': {
      return isMatch(claim, condition.value);
    }
    case 'stringNotLike': {
      return !isMatch(claim, condition.value);
    }
    default:
      return false;
  }

  // won't reach here
};
