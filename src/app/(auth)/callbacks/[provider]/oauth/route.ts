import { notFound, redirect, RedirectType } from 'next/navigation';
import { NextRequest } from 'next/server';

import api from '@/lib/api';
import { searchParamsToObject } from '@/utils/object';
import { getApiErrorMessage } from '@/utils/error';

interface RouteParams {
  params: Promise<{ provider: string }>;
}

const providers = ['github', 'google'];

export async function GET(request: NextRequest, props: RouteParams) {
  const { provider } = await props.params;
  if (!providers.includes(provider)) {
    return notFound();
  }

  const payload = searchParamsToObject(request.nextUrl.searchParams);

  try {
    await api.post(`v1/verify/${provider}`, { json: payload });
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, `Failed to login to ${provider}`);
    redirect(`/login?redirect_error=${errorMessage}`, RedirectType.replace);
  }

  redirect('/u', RedirectType.replace);
}
