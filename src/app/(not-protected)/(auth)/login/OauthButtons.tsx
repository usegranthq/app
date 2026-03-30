'use client';

import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import { startTransition, useActionState } from 'react';

import ROUTES from '@/constants/routes';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/shadcn/components/ui/button';

const githubLogin = async () => {
  await authClient.signIn.social({
    provider: 'github',
    callbackURL: ROUTES.LOGIN_CALLBACK,
  });
};

const googleLogin = async () => {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: ROUTES.LOGIN_CALLBACK,
  });
};

export default function OauthButtons() {
  const [, loginGithub, isPendingGithub] = useActionState(githubLogin, null);
  const [, loginGoogle, isPendingGoogle] = useActionState(googleLogin, null);

  const handleClickGithub = () => {
    startTransition(loginGithub);
  };

  const handleClickGoogle = () => {
    startTransition(loginGoogle);
  };

  const isPending = isPendingGithub || isPendingGoogle;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={handleClickGithub} disabled={isPending}>
        <SiGithub className="mr-2 size-4" />
        Github
      </Button>
      <Button variant="outline" onClick={handleClickGoogle} disabled={isPending}>
        <SiGoogle className="mr-2 size-4" />
        Google
      </Button>
    </div>
  );
}
