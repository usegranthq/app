import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { decodeJwt } from 'jose';

import VerifyForm from './VerifyForm';
import { isNullOrUndefined } from '@/utils/validators';

const getEmailFromCookies = (): string | undefined => {
  const cookieStore = cookies();
  const hasVerifyCookie = cookieStore.has('verify');

  if (!hasVerifyCookie) {
    return;
  }

  const verifyCookie = cookieStore.get('verify');
  const claims = decodeJwt(verifyCookie?.value as string);

  if (isNullOrUndefined(claims.email)) {
    return;
  }

  return claims.email as string;
};

export default function Login() {
  const email = getEmailFromCookies();

  if (!email) {
    redirect('/login', RedirectType.replace);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-center">Verification</h1>
        <p className="mb-10 text-center text-sm mt-2">
          We have sent you a verification code to <span className="text-muted-foreground font-medium">{email}.</span>{' '}
          Enter it below
        </p>
        <VerifyForm />
      </div>
    </div>
  );
}
