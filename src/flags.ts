import type { ReadonlyRequestCookies } from 'flags';
import { dedupe, flag } from 'flags/next';

import constants from '@/constants';
import { env } from '@/env';

type DedupeParams = {
  cookies: ReadonlyRequestCookies;
};

type Entities = {
  inviteCode: string | undefined;
};

const identify = dedupe(({ cookies }: DedupeParams): Entities => {
  const inviteCode = cookies.get(constants.INVITE_COOKIE)?.value;

  return {
    inviteCode,
  };
});

export const inviteFlag = flag<boolean, Entities>({
  key: 'invite-flag',
  identify,
  decide({ entities }) {
    if (env.INVITE_TOKEN === '') {
      return true;
    }

    return env.INVITE_TOKEN === entities?.inviteCode;
  },
});
