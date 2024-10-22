import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { decodeJwt } from 'jose';

import VerifyForm from './VerifyForm';
import { isNullOrUndefined } from '@/utils/validators';
import * as constants from '@/constants';

const getEmailFromCookies = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();

  const verifyCookie = cookieStore.get(constants.VERIFY_COOKIE);
  if (!verifyCookie) {
    return;
  }

  const claims = decodeJwt(verifyCookie.value);
  if (isNullOrUndefined(claims.email)) {
    return;
  }

  return claims.email as string;
};

export default async function Login() {
  const email = await getEmailFromCookies();

  if (!email) {
    redirect('/login', RedirectType.replace);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-sm">
        <h1 className="text-center text-2xl font-bold">Verification</h1>
        <p className="mb-10 mt-2 text-center text-sm">
          We have sent you a verification code to <span className="font-medium text-muted-foreground">{email}.</span>{' '}
          Enter it below
        </p>
        <VerifyForm />
      </div>
    </div>
  );
}
